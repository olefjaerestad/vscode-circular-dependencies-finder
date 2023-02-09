const ba = require('../a/a.js');

module.exports = {
  b: () => {
    console.info('b() calls a', ba.a());
  }
};
