import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");


var firebaseConfig = {
  apiKey: "AIzaSyAP8oTqvKeLh4C6ppwM3klUmd-sgOKredM",
  authDomain: "expenses-management-bab7f.firebaseapp.com",
  projectId: "expenses-management-bab7f",
  storageBucket: "expenses-management-bab7f.appspot.com",
  messagingSenderId: "295446821945",
  appId: "1:295446821945:web:97969be361792e09fc61e8",
  measurementId: "G-JCWEBGE49B",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA43j3wbJTyAHL-SAFzs8bvXI9aMBM7e_0",
//   authDomain: "database-fcode-3fef9.firebaseapp.com",
//   databaseURL: "https://database-fcode-3fef9.firebaseio.com",
//   projectId: "database-fcode-3fef9",
//   storageBucket: "database-fcode-3fef9.appspot.com",
//   messagingSenderId: "669779502578",
//   appId: "1:669779502578:web:05c2bdbf664baffd08376b",
// };

firebase.initializeApp(firebaseConfig);
 
export const db = firebase.firestore();

export default firebase;
