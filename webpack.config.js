var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		App: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'api'),
		filename: 'public/js/bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader'
			}
		}]
	},
	mode: 'production'
}