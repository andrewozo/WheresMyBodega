// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTlce3bs8_drLvqiM4WMFgMh3v1OluboM",
  authDomain: "wheresmybodega-aa38e.firebaseapp.com",
  projectId: "wheresmybodega-aa38e",
  storageBucket: "wheresmybodega-aa38e.appspot.com",
  messagingSenderId: "685053089652",
  appId: "1:685053089652:web:7e26f8d1aace3b4e77fe21",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// if (firebase.apps.length === 0) {
//   app = firebase.initializeApp(firebaseConfig);
// } else {
//   app = firebase.app();
// }
export const db = getFirestore(app);

const auth = firebase.auth();

export { auth };
