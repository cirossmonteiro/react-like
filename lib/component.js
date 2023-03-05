import { parseFragment } from 'parse5';
import { v4 as uuidv4 } from 'uuid';

import { REGEX, capitalizeFirstLetter } from './utils.js';


/**
 * Store all component instances
 */
export var Components = [];


/**
 * Store all component classesx
 */
export var ComponentClasses = [];






class InternalState {
  ignoreRender = true;

  /**
   * State
   * @param {*} render - callback to trigger right after every change in state
   * @param {*} initialState
   */
  constructor(render, initialState = {}) {
    console.log("InternalState", "constructor", {});
    this.render = render;
    this.state = initialState;
  }

  /**
   * Set new value for state
   * @param {object | object => object} cb 
   */
  set = (cb) => {
    console.log("InternalState", "set", cb);
    if (cb instanceof Function) {
      console.log("Old state: ", this.state);
      this.state = cb(this.state);
      console.log("New state: ", this.state);
    } else {
      this.state = {
        ...this.state,
        ...cb
      };
    }
    
    if (this.ignoreRender) {
      this.ignoreRender = false;
    } else {
      this.render();
    }
  }

  /**
   * Returns state
   * @param {string} key - existing field's name in state
   * @returns {*} - whole state (key NOT provided) or just a field (key provided)
   */
  get = (key = null) => key ? this.state[key] : this.state;
  
}


/**
 * Component Factory, to differentiate root component from the others
 * @param {function} render - render callback
 * @param {boolean} isRoot - inform the instance it's going to be used to trigger the render
 * @returns {class} - component class
 */
const InternalComponent = (render = null, isRoot = false) => class {
  static HTMLTagWrapper = "div";
  key = null;

  constructor(key = null, props = {}) {
    console.log("InternalComponent", "constructor", key);

    if (key === null) {
      throw new Error(`Key MUST be provided.`);
    }

    if (!ComponentClasses.find(c => this instanceof c)) {
      throw new Error(`Component must be pushed into ComponentClasses array.`);
    }

    this.key = key;
    this.props = props;
    this.id = uuidv4();
    if (isRoot) {
      this.rootRender = () => {
        const html = this.render();
        render(html);
        clearUnusedComponentInstances(html);
        console.log(99, html);
        getAllEvents(html);
      }
    }
    this.state = new InternalState(isRoot ? this.rootRender : render);
    Components.push(this);
  }

  setProps = (props) => {
    // to-do: check for differences
    this.props = props;
    this.render();
  }

  getClass = () => {
    return ComponentClasses.find(cc => this instanceof cc);
  }

  tag = () => {
    return this.getClass().HTMLTagWrapper;
  }

  _render = () => {
    return `<${this.tag()} id="${this.id}">${this.renderHTML()}</${this.tag()}>`;
  }

  render = () => {
    return replaceComponentDeclaration(this._render());
  }
}

/**
 * Remove component instances that weren't present on the last render
 * @param {string} html 
 */
const clearUnusedComponentInstances = (html = "") => {
  //to-do: lazy solution, improve this
  Components = Components.filter(c => html.includes(` id="${c.id}"`))
}


/**
 * Adding component class to internal component library
 * @param {class[]} - array of component classes to be loaded
 */
const internalConcat = (newClasses = []) => {
  console.log(146, newClasses);
  ComponentClasses = [
    ...ComponentClasses,
    ...newClasses
  ];
}


/**
 * It's the main render. Everytime it's called, the whole DOM is rebuild from the ground.
 * @param {string} html - the full HTML source code to be set in root's innerHTML
 * @param {string} id - id of HTML element in idnex.html to be used as root
 */
const internalRender = (html = "", id = "root") => {
  document.getElementById(id).innerHTML = html;
}


/**
 * Build final HTML
 * @param {string} html - source code with <component.componentNameInLowerCase />
 * @param {string} children - to-do: consider doing props.children
 */
const replaceComponentDeclaration = (html = ""/* , children = "" */) => {
  const componentsInHTML = html.match(REGEX.SELF_CLOSING_TAG) || [];

  componentsInHTML.forEach(componentMatched => {
    let key;
    const props = {};
    const componentName = componentMatched.match(REGEX.COMPONENT)[1];
    const cc = ComponentClasses.find(cc => {
      // to-do: improve this mechanism
      return cc.id === capitalizeFirstLetter(componentName);
    });
    
    const tag = cc.HTMLTagWrapper;
    const attributes = componentMatched.match(REGEX.COMPONENT_PROPERTIES)
      .map(group => group.match(REGEX.PROPERTY))
      .map(group => ({
        name: group[1],
        value: group[3]
          ? (!["\"", "'"].includes(group[3][0]) ? Number(group[3]) : group[3])
          : true 
      }));
      // .map(attr => `${attr.name}=${attr.value}`);
    
    attributes.forEach(attr => {
      if (attr.name === "key") {
        key = attr.value;
      } else {
        props[attr.name] = attr.value;
      }
    });

    // find component, update his props, attach events
    const componentIndex = Components.findIndex(component => {
      return (component instanceof cc) && component.key === key
    });

    if (componentIndex === -1) {
      Components.push(new cc(key, props));
    } else {
      Components[componentIndex].setProps(props);
    }
    
    const component = Components.find(component => {
      return component instanceof cc && component.key === key
    });

    // return `<${tag}>${children}</${tag}>`;
    const componentHTML = `<${tag} id="${component.id}">${component.renderHTML()}</${tag}>`;
    html = html.replace(componentMatched, componentHTML);
  });

  return html;
}


/**
 * Search for event data in object and its children
 * @param {object} obj 
 * @returns 
 */
const parseForEvents = (obj) => {
  let events = [];
  const attrs = obj?.attrs ? Array.from(obj?.attrs) : [];
  const childNodes = obj?.childNodes ? Array.from(obj?.childNodes) : [];

  attrs.forEach(attr => {
    const attrMatch = attr.name.match(REGEX.EVENT_ONE);
    const valueMatch = attr.value.match(REGEX.ATTR_VALUE);
    if (attrMatch) {
      console.log(236, attr.name, attrMatch);
      events.push({
        tag: obj.tagName,
        type: attrMatch[1],
        id: valueMatch[1],
        key: valueMatch[2]
      });
    }
  });

  childNodes.forEach(child => {
    events = [
      ...events,
      ...parseForEvents(child)
    ];
  });

  return events;
}


/**
 * parse final HTML then add all event listeners
 * @param {string} html 
 */
const getAllEvents = (html = "") => {
  const events = parseForEvents(parseFragment(html));
  events.forEach(event => {
    const { id, key, tag, type}  = event;
    const component = Components.find(c => c.id === id);
    const element = document.querySelector(`${tag}[event-${type}="${id}/${key}"]`);

    console.log(266, event);
    const eType = capitalizeFirstLetter(type);
    const eTag = capitalizeFirstLetter(tag);
    const handlerName = `handle${eTag}${eType}`;
    
    if (!component.hasOwnProperty(handlerName)) {
      throw new Error(`Could't find "${handlerName}". Are you sure you've defined it?`);
    }

    const handler = () => component[handlerName](key);
    
    element.addEventListener(type, handler);
  });
}
console.log(2831);

export default {
  Component: InternalComponent,
  concat: internalConcat,
  render: internalRender,
  // State: InternalState // to-think: any need to invoke this class directly?
};

// export const Component = InternalComponent;
// export const Concat =  internalConcat;
// export const Render = internalRender;

console.log(2832);