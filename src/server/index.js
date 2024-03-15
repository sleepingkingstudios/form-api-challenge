/** @module server */

import express from 'express';

import { handler as getResponses } from './get-responses/index.js';

const app = express();

app.get('/v1/api/forms/:formId/submissions', getResponses);

export { app as server };
