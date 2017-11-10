
//
// Use the path module so that this will work on Windows systems
//
var path = require('path');

//
// Compile main.js (and its dependencies) into dist/bundle.js.
//
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

