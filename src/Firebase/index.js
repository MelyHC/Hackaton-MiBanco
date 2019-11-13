import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCPSO2f0YeeLPJ0cMVeQ_pkn5StDi7KpsE",
    authDomain: "mibanco-c6e5b.firebaseapp.com",
    databaseURL: "https://mibanco-c6e5b.firebaseio.com",
    projectId: "mibanco-c6e5b",
    storageBucket: "mibanco-c6e5b.appspot.com",
    messagingSenderId: "185630008871",
    appId: "1:185630008871:web:534226b910de0c1da1d002"
  };
  
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

const authUser = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);
const logout =() => firebase.auth().signOut();
const db = firebase.firestore()

export { authUser, logout, db };