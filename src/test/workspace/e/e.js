const ef = require('../f/f.js');

module.exports = {
  e: () => {
    console.info('e() calls f', ef.f());
  }
};
