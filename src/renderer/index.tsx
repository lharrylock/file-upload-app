import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";

import App from "./containers/App";

render(
    <App/>,
    document.getElementById("template-electron-react")
);
