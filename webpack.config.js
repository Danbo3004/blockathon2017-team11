const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
     app: './app/javascripts/app.js',
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/javascripts', to: "app/javascripts" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/images', to: "app/images" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/stylesheets', to: "app/stylesheets" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/fonts', to: "app/fonts" }
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
       },
       {
            test: /\.ts$/,
            loaders: [
                'babel-loader?presets[]=es2015',
                'awesome-typescript-loader',
                // For angular2:
                //'angular2-template-loader',
                //`angular2-router-loader?genDir=compiled/app&aot=true`
            ],
            exclude: [/\.(spec|e2e|d)\.ts$/]
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
      },

    ]
  }
}
