import { https } from 'firebase-functions';
import app from './app';

import {
  extractMemoryInfo,
  removeMemory,
  removeMemoryFile,
  userCriteriaUpdate
} from './triggers';

const api = https.onRequest(app);

export {
  extractMemoryInfo,
  removeMemory,
  removeMemoryFile,
  userCriteriaUpdate,
  api
};