/* eslint no-console: 0 */
import process from 'process';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../../webpack.config.js';
import Html from './Html';

process.cwd(path.resolve(__dirname, '../..'));

const IS_DEV = process.env.NODE_ENV !== 'production';
const port = IS_DEV ? 3000 : 3000;
const app = new express();

const indexMiddleware = (req, res) => {
	res.send('<!doctype html>\n' +
		ReactDOMServer.renderToString(React.createElement(Html, {assets: {javascript: {
			client: '/static/bundle.js',
		}}}))
	);
};

if (IS_DEV) {
	const compiler = webpack(config);

	const devMiddlewareOptions = {
		publicPath: config.output.publicPath,
		hot: true,
		historyApiFallBack: true,
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false,
		},
	};

	const hotMiddlewareOptions = {
		log: console.log,
		path: '/__webpack_hmr',
		heartbeat: 10 * 1000,
	};

	const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);
	const hotMiddleware = webpackHotMiddleware(compiler, hotMiddlewareOptions);

	app.use(devMiddleware);
	app.use(hotMiddleware);

} else {
	app.use('/static', express.static(path.resolve(process.cwd(), 'build', 'public')));
}

app.get('/', indexMiddleware);

app.listen(3000, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log(err);
	}
	console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
