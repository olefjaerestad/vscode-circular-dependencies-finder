const ab = require('../b/b.js');

module.exports = {
  a: () => {
    console.info('a() calls b', ab.b());
  }
};
