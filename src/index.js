import { listen } from './server/index.js';

const port = process.env.PORT || 3000;

listen(port, () => {
  console.log('[server]: Server is running...');
});
