import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";

import reducer from "./reducers/reducers.js";
import Login from "./components/Login/Login";
import LazyLoadingSpinner from "./components/LazyLoadingSpinner/LazyLoadingSpinner";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import "./App.css";

const Cms = lazy(() => import("./components/AppContainer/AppContainer"));
const Statistics = lazy(() => import("./components/Statistics/Statistics"));
const Wishlist = lazy(() => import("./components/Wishlist/Wishlist"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));

const LazyCms = () => (
	<Suspense fallback={<LazyLoadingSpinner />}>
		<Cms />
	</Suspense>
);

const LazyStatistics = () => (
	<Suspense fallback={<LazyLoadingSpinner />}>
		<Statistics />
	</Suspense>
);

const LazyWishlist = () => (
	<Suspense fallback={<LazyLoadingSpinner />}>
		<Wishlist />
	</Suspense>
);

const LazyNotFound = () => (
	<Suspense fallback={<LazyLoadingSpinner />}>
		<NotFound />
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
					<Route path="*" component={LazyNotFound} />
				</Switch>
			</Router>
		</Provider>
	</ConfigProvider>
);

export default App;
