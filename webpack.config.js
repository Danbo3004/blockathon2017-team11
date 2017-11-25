const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
     app: './app/javascripts/app.js',
     app2: './app/javascripts/app2.js',
     app3: './app/javascripts/app3.js',
  },

  //'./app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    // filename: 'app.js'
    filename: 'bundle--[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/index2.html', to: "index2.html" },
      { from: './app/index3.html', to: "index3.html" }
    ]),
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      },
      {
          test: /\.woff$/,
          use: 'file-loader?name=[name].[ext]&outputPath=../fonts/&publicPath=/app/fonts/&mimetype=application/font-woff'
       } ,
       {
          test: /\.woff2$/,
          use: 'file-loader?name=[name].[ext]&outputPath=../fonts/&publicPath=/app/fonts/&mimetype=application/font-woff2'
      } ,
       {
            test: /\.ttf$/,
            use: 'file-loader?name=[name].[ext]&outputPath=../fonts/&publicPath=/app/fonts/&mimetype=application/font-sfn'
       } ,
       {
          test: /\.eot$/,
          use: 'file-loader?name=[name].[ext]&outputPath=../fonts/&publicPath=/app/fonts/'
       }
       ,{
          test: /\.svg$/,
          use: 'file-loader?name=[name].[ext]&outputPath=../fonts/&publicPath=/app/fonts/&mimetype=image/svg+xml'
       }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      }
    ]
  }
}
