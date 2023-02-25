import Lib from "./lib/component";

const test_names = [
  "Jacob",
  "James",
  "Jordan",
  "Julie"
]


class Root extends Lib.Component(Lib.render, true) {
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
    const children = this.state.get("children");

    const rowsHTML = children.map((child, index) => {
      return `
        <component.parent 
          key=${index}
          name="${child.name}"
          factor=${child.factor}
          view
        />
      `;
    }).join("\n");

    const contents = `
      <h1>My table</h1>
      <button event-click="${this.id}/add">add row</button>
      <button event-click="${this.id}/remove">remove row</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Factor</th>
            <th>Count</th>
            <th>Result</th>
          </tr>
        </div>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    `;

    return contents;
  }
}

Lib.concat([
  Root
]);

const Main = new Root("root");

const Component = Lib.Component(Main.rootRender);

class Parent extends Component {
  static HTMLTagWrapper = "tr";
  constructor(key, props){
    super(key, props);
    this.state.set({ count: 0 });
  }

  handleButtonClick = () => {
    this.state.set(state => ({ ...state, count: state.count+1 }));
  }

  renderHTML = () => {
    const contents = `
      <td>
        ${this.props.name}
      </td>
      <td>
        ${this.props.factor}
      </td>
      <td>
        <button event-click="${this.id}/times">multiply by ${this.state.get("count")}</button>
      </td>
      <td>
        ${this.props.factor * this.state.get("count")}
      </td>
    `;

    return contents;
  }
}


Lib.concat([
  Parent
]);

Main.rootRender();


console.log("Webpack update ", new Date().toISOString());