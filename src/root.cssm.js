import Lib from "../lib/component";

import renderHTMLImported from "./root.rcssm.js";


const test_names = [
  "Jacob",
  "James",
  "Jordan",
  "Julie"
];


export class Root extends Lib.Component(Lib.render, true) {
  static id = "Root";
  
  constructor(key, props) {
    super(key, props);
    this.state.set({
      children: [
        { name: "Jack", factor: 2 },
        { name: "John", factor: 3 },
        { name: "Joseph", factor: 5 }
      ]
    })
  }

  handleButtonClick = (key = "") => {
    if (key === "add") {
      this.state.set(state => {
        const factor = state.children.length;
        const name = test_names[factor % test_names.length];
        return {
          ...state,
          children: [
            ...state.children,
            { name, factor }
          ]
        }
      });
    } else if (key === "remove") {
      this.state.set(state => {
        state.children.pop();
        return state;
      });
    }
    
  }

  renderHTML = () => {
    return renderHTMLImported({
      id: this.id,
      props: this.props,
      state: this.state
    });
  }
}

Lib.concat([
  Root
]);

export const Main = new Root("root");

export const Component = Lib.Component(Main.rootRender);

console.log("Webpack update ", new Date().toISOString());
