/* global document */

/**
 * This file's sole purpose is to provide an entry point for our app bundle, which will be served via /build/public/bundle.js
 * Note: AppContainer will not expose that we are using HMR on production (see react-hot-loader source code).
 */
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import * as firebase from 'firebase';
import config from './app/config/config.js';

firebase.initializeApp(config);

const rootEl = document.getElementById('root');

ReactDOM.render(
	<AppContainer>
		<App />
	</AppContainer>,
	rootEl
);

if (module.hot) {
	module.hot.accept('./app/App', () => {
		// If you use Webpack 2 in ES modules mode, you can
		// use <App /> here rather than require() a <NextApp />.
		const NextApp = require('./app/App').default;
		ReactDOM.render(
			<AppContainer>
				<NextApp />
			</AppContainer>,
			rootEl
		);
	});
}
