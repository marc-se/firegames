var fs = require('fs');
var path = require('path');

var nodeModules = {};
fs.readdirSync('node_modules').filter(function(x) {
	return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
	devtool: false,  // 'sourcemap', // eval
	target: 'node',
	// context: __dirname,
	entry: {
		server: [ // if you pass an array, the first items will be required before the last item is loaded; only last item is being exported
			'./src/server/server.js',
		],
	},
	output: {
		path: path.join(__dirname, 'build', 'server'),
		filename: '[name].js',
		chunkFilename: '[name]-[hash].js',
	},
	externals: nodeModules,
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
		],
	},
};
