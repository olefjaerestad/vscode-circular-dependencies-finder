const a = require('./a/a.js');
const b = require('./b/b.js');
const c = require('./c/c.js');
const d = require('./d/d.js');

a.a();
b.b();
c.c();
d.d();

module.exports = {
  index: () => {
    console.info('index()');
  }
};
