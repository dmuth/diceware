//
// Use the path module so that this will work on Windows systems
//
const path = require('path');

const webpack = require('webpack')

//
// Compile main.js (and its dependencies) into dist/bundle.js.
//
module.exports = (env, argv) => ({
  mode: argv.mode || 'development',  // Default to development mode
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Use source maps only in development
  devtool: argv.mode === 'development' ? 'eval-source-map' : false,  
  watch: argv.mode === 'development', // Enable watch only in development
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
});

