const fd = require('../d/d.js');

module.exports = {
  f: () => {
    console.info('f() calls d', fd.d());
  }
};
