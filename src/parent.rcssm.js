const contents = `
  <td>
    ${props.name}
  </td>
  <td>
    ${props.factor}
  </td>
  <td>
    <button event-click="${id}/times">multiply by ${state.get("count")}</button>
  </td>
  <td>
    ${props.factor * state.get("count")}
  </td>
`;

return contents;