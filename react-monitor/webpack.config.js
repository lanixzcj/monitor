var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack/hot/dev-server',
        path.resolve(__dirname, 'src/app.js')
    ],
  devtool: 'sourcemap',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query:
            {
                presets:['react','es2015']
            }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};
