const de = require('../e/e.js');

module.exports = {
  d: () => {
    console.info('d() calls e', de.e());
  }
};
