import * as a from 'firebase-admin';
const serviceKey = require('./oqa_service_key.json')
require('dotenv').config();

const admin = a.initializeApp({
  credential: a.credential.cert(serviceKey),
  storageBucket: process.env.storageBucket
});

const db = admin.firestore();
const storage = admin.storage().bucket();
const auth = admin.auth();

export {
  admin,
  db,
  storage,
  auth
};
