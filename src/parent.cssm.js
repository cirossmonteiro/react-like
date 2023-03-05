// import { Component } from "./index.js";
import Lib from "../lib/component";
import { Component, Main } from "./root.cssm.js";

import renderHTMLImported from "./parent.rcssm.js";


export class Parent extends Component {
  static id = "Parent";
  static HTMLTagWrapper = "tr";
  
  constructor(key, props){
    super(key, props);
    this.state.set({ count: 0 });
  }

  handleButtonClick = () => {
    this.state.set(state => ({ ...state, count: state.count+1 }));
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
  Parent
]);

Main.rootRender();

console.log("Webpack update ", new Date().toISOString());
