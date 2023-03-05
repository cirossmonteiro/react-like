const children = state.get("children");

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
  <button event-click="${id}/add">add row</button>
  <button event-click="${id}/remove">remove row</button>
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

console.log("Webpack update ", new Date().toISOString());