var compiler = require('riot/compiler/compiler');


module.exports = function (source) {

  var content = source;
  var options = {};

  if (this.cacheable) this.cacheable();

  Object.keys(options).forEach(function(key) {
    switch(options[key]) {
      case 'true':
        options[key] = true;
        break;
      case 'false':
        options[key] = false;
        break;
      case 'undefined':
        options[key] = undefined;
        break;
      case 'null':
        options[key] = null;
        break;
    }
  });

  try {
    return compiler.compile(content, options);
  } catch (e) {
    throw new Error(e);
  }
};