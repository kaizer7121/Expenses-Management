import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");


export var firebaseConfig = {
  apiKey: "AIzaSyAP8oTqvKeLh4C6ppwM3klUmd-sgOKredM",
  authDomain: "expenses-management-bab7f.firebaseapp.com",
  projectId: "expenses-management-bab7f",
  storageBucket: "expenses-management-bab7f.appspot.com",
  messagingSenderId: "295446821945",
  appId: "1:295446821945:web:97969be361792e09fc61e8",
  measurementId: "G-JCWEBGE49B",
};

firebase.initializeApp(firebaseConfig);
 
export const db = firebase.firestore();

export default firebase;
