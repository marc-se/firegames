import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ConfigProvider, Spin, Icon } from "antd";
import enUS from "antd/lib/locale-provider/en_US";

import NotFound from "./components/NotFound/NotFound";
import reducer from "./reducers/reducers.js";
import Login from "./components/Login/Login";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import "./App.css";

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Cms = lazy(() => import("./components/AppContainer/AppContainer"));
const Statistics = lazy(() => import("./components/Statistics/Statistics"));
const Wishlist = lazy(() => import("./components/Wishlist/Wishlist"));

const LazyCms = () => (
	<Suspense fallback={<Spin indicator={loadingIcon} />}>
		<Cms />
	</Suspense>
);

const LazyStatistics = () => (
	<Suspense fallback={<Spin indicator={loadingIcon} />}>
		<Statistics />
	</Suspense>
);

const LazyWishlist = () => (
	<Suspense fallback={<Spin indicator={loadingIcon} />}>
		<Wishlist />
	</Suspense>
);

let store = createStore(reducer);

const App = () => (
	<ConfigProvider locale={enUS}>
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact={true} path="/" component={Login} />
					<AuthRoute exact={true} path="/cms" component={LazyCms} />
					<AuthRoute exact={true} path="/statistics" component={LazyStatistics} />
					<AuthRoute exact={true} path="/wishlist" component={LazyWishlist} />
					<Route path="*" component={NotFound} />
				</Switch>
			</Router>
		</Provider>
	</ConfigProvider>
);

export default App;
