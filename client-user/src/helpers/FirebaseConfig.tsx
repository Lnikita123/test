import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCUIRf2yVKUV6RT8JhukNzQzhkTp3mFFc",
  authDomain: "alvisproject-f56eb.firebaseapp.com",
  projectId: "alvisproject-f56eb",
  storageBucket: "alvisproject-f56eb.appspot.com",
  messagingSenderId: "676115894489",
  appId: "1:676115894489:web:5e5fad0793d00ff3d9eec8",
  measurementId: "G-S7NWJ7JB2T",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
