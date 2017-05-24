var path = require('path');
var webpack = require('webpack');
var process = require('process');
var CompressionPlugin = require('compression-webpack-plugin');

const IS_DEV = process.env.NODE_ENV !== 'production';

module.exports = {
	devtool: IS_DEV ? 'cheap-module-eval-source-map' : 'cheap-module-source-map', // eval
	target: 'web',
	// context: __dirname,
	entry: {
		// if you pass an array, the first items will be required before the last item is loaded; only last item is being exported
		bundle: [].concat(
			IS_DEV
				? [
					'react-hot-loader/patch', // required for react hot loading
					'webpack-hot-middleware/client', // required to connect our server with webpack-hot-middleware
					'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
					'./src/index', // our main entry file to be bundled
				]
				: ['./src/index']
		),
	},
	output: {
		path: path.join(__dirname, 'build', 'public'),
		filename: '[name].js',
		chunkFilename: '[name]-[hash].js',
		publicPath: '/static/',
	},
	plugins: [
		/* shared plugins here */
	].concat(
		IS_DEV
			? [
					/* dev only plugins here */
				new webpack.optimize.OccurrenceOrderPlugin(),
				new webpack.HotModuleReplacementPlugin(),
				new webpack.NoErrorsPlugin(),
			]
			: [
				new webpack.optimize.DedupePlugin(),
				new webpack.NoErrorsPlugin(),
				new CompressionPlugin({
					asset: '[path].gz[query]',
					algorithm: 'gzip',
					test: /\.js$|\.css$|\.html$/,
					threshold: 10240,
					minRatio: 0,
				}),
				new webpack.optimize.UglifyJsPlugin({
					mangle: true,
					compress: {
						warnings: false,
						pure_getters: true,
						unsafe: true,
						unsafe_comps: true,
						screw_ie8: true,
					},
					output: {
						comments: false,
					},
					exclude: [/\.min\.js$/gi], // skip pre-minified libs
				}),
			]
	),
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loaders: ['eslint'],
				include: path.join(__dirname, 'src'),
			},
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.scss$/,
				loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap',
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react', 'stage-2'],
				},
			},
			{
				test: /\.less$/,
				loaders: ['style-loader', 'css-loader?importLoaders=1', 'less-loader'],
			},
			{
				test: /\.css$/,
				loader: 'style!css',
			},
			{
				test: /\.(jpg|png)$/,
				loader: 'file?name=[path][name].[hash].[ext]',
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.svg$/,
				loader: 'raw-loader',
			},
		],
	},
};
