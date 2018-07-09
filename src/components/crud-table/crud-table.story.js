import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import CRUDTable from "./crud-table";

const columns = [
  { name: "id", description: "Id" },
  { name: "fullName", description: "Nome Completo" },
  { name: "age", description: "Idade" },
  { name: "profession", description: "Profissão" }
];
const rows = [
  {
    id: 1,
    fullName: "Matheus Blödorn Claudino",
    age: 18,
    profession: "Programador"
  },
  { id: 2, fullName: "Anna Giulia Yahia", age: 17, profession: "Estudante" }
];

const actions = [
  {
    description: "Excluir",
    action: action("buttonAction"),
    allowAction: row => row.age > 17
  }
];
console.log(CRUDTable);
storiesOf("CRUD Table", module)
  .add("default", () => (
    <CRUDTable
      title="Pessoas"
      columns={columns}
      rows={rows}
      onRowClick={action("onRowClick")}
      onAdd={action("onAdd")}
      allowAdd={() => true}
      onFilter={action("onFilter")}
    />
  ))
  .add("with actions", () => (
    <CRUDTable
      title="Pessoas"
      columns={columns}
      rows={rows}
      onRowClick={action("onRowClick")}
      onAdd={action("onAdd")}
      allowAdd={action("allowAdd")}
      onFilter={action("onFilter")}
      actions={actions}
    />
  ));
