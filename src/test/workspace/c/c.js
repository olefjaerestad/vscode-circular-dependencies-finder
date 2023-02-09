const ce = require('../e/e.js');

module.exports = {
  c: () => {
    console.info('c() calls e', ce.e());
  }
};
