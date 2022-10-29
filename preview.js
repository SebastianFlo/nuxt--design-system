/**
 * A preview server designed to run continously somewhere in AWS.
 * Gives content team an instant preview of new created content, or changes to existing.
 */
const { loadNuxt } = require('nuxt');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

(async function start() {
  // create the Nuxt instance
  const nuxt = await loadNuxt('start');

  // add render ass middleware
  app.use(nuxt.render);

  // start the server
  app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log('Server listening on `localhost:' + port + '`.');
})();
