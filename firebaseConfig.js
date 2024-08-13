import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAODFOJJXER2gpUdKWoXvVFhlSW7sNkOm8',
  authDomain: 'receitas-cb7ae.firebaseapp.com',
  projectId: 'receitas-cb7ae',
  storageBucket: 'receitas-cb7ae.appspot.com',
  messagingSenderId: '298760423289',
  appId: '1:298760423289:web:66dd738204d8fa7cfcd1a8',
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };


