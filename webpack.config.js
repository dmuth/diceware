//
// Use the path module so that this will work on Windows systems
//
const path = require('path');

const webpack = require('webpack')

//
// Compile main.js (and its dependencies) into dist/bundle.js.
//
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'eval-source-map', // Helps with debugging
  watch: true, // Enables watch mode
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000, // Check for changes every second
  },
  optimization: {
    moduleIds: 'named', // Makes it easier to debug
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js'
    })
  ]
};

