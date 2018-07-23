import * as React from "react";
import { render } from "react-dom";

class App extends React.Component {
    public render() {
        return <div>Hello World</div>;
    }
}

render(
    <App/>,
    document.getElementById("template-electron-react")
);
