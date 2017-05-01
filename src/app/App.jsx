/* @flow */
import { Router, Route, hashHistory } from 'react-router';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Statistics from './components/Statistics/Statistics.js';
import NotFound from './components/NotFound/NotFound.js';
import reducer from '../../reducers/reducers.js';
import AppContainer from './components/AppContainer/AppContainer.js';

let store = createStore(reducer);

export default class App extends Component {
	render() {
		return (
			<LocaleProvider locale={enUS}>
				<Provider store={store}>
					<Router history={hashHistory}>
						<Route path="/" component={AppContainer} />
						<Route path="/statistics" component={Statistics} />
						<Route path="*" component={NotFound} />
					</Router>
				</Provider>
			</LocaleProvider>
		);
	}
}
