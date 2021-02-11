"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.userCriteriaUpdate = exports.removeMemoryFile = exports.removeMemory = exports.extractMemoryInfo = void 0;
const firebase_functions_1 = require("firebase-functions");
const app_1 = require("./app");
const triggers_1 = require("./triggers");
Object.defineProperty(exports, "extractMemoryInfo", { enumerable: true, get: function () { return triggers_1.extractMemoryInfo; } });
Object.defineProperty(exports, "removeMemory", { enumerable: true, get: function () { return triggers_1.removeMemory; } });
Object.defineProperty(exports, "removeMemoryFile", { enumerable: true, get: function () { return triggers_1.removeMemoryFile; } });
Object.defineProperty(exports, "userCriteriaUpdate", { enumerable: true, get: function () { return triggers_1.userCriteriaUpdate; } });
const api = firebase_functions_1.https.onRequest(app_1.default);
exports.api = api;
//# sourceMappingURL=index.js.map