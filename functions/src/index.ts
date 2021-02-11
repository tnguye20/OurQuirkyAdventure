// import * as functions from 'firebase-functions';

import {
  extractMemoryInfo,
  removeMemory,
  removeMemoryFile
} from './triggers';

// exports.helloWorld = functions.https.onRequest((req, res) => {
//   res.json({result: `Thang's API is up and running`});
// });

export {
  extractMemoryInfo,
  removeMemory,
  removeMemoryFile
};