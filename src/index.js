import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebase from "firebase/app";
import config from "./config/config.js";
import registerServiceWorker from "./registerServiceWorker";

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
