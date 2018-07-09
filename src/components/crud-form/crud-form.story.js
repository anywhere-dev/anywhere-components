import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import CRUDForm from "./crud-form";

storiesOf("CRUD Form", module).add("default", () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      padding: 8,
      backgroundColor: "#fafafa"
    }}
  >
    <CRUDForm />
  </div>
));
