import { AddToQueueSharp, FilterVintage } from '@material-ui/icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
require('dotenv').config();

const firebaseConfig = ({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
});
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const db = firebase.firestore();
const storage = firebase.storage().ref();

export { firebaseConfig as firebase };
export { auth, db, storage };