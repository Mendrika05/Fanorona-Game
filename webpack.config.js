const path= require('path');

module.exports= {
	entry: './src/js/gui.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(png)$/i,
				type: 'asset/resource',
			}
		]
	}
};