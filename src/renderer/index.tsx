import * as React from "react";
import { render } from "react-dom";

const styles = require("./style.css");

class App extends React.Component {
    public render() {
        return <div className={styles.container}>Hello World</div>;
    }
}

render(
    <App/>,
    document.getElementById("template-electron-react")
);
