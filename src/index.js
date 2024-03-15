import { server } from './server/index.js';

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('[server]: Server is running...');
});
