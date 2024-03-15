/** @module server */

import express from 'express';

const app = express();

app.get('/', (request, response) => {
  response.send('OK');
});

/**
 * Start the application server.
 * @function
 * @param {number} port - The port to run the server on.
 * @param {function} callback - A function to run when the server is started.
 */
export const { listen } = app;
