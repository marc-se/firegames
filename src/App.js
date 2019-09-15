import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import Statistics from "./components/Statistics/Statistics";
import NotFound from "./components/NotFound/NotFound";
import reducer from "./reducers/reducers.js";
import AppContainer from "./components/AppContainer/AppContainer";
import Login from "./components/Login/Login";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import "./App.css";

let store = createStore(reducer);

const App = () => (
	<ConfigProvider locale={enUS}>
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact={true} path="/" component={Login} />
					<AuthRoute exact={true} path="/cms" component={AppContainer} />
					<AuthRoute exact={true} path="/statistics" component={Statistics} />
					<Route path="*" component={NotFound} />
				</Switch>
			</Router>
		</Provider>
	</ConfigProvider>
);

export default App;
