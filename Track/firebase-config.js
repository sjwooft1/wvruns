// Firebase configuration
// This file should be loaded after the Firebase SDK script tag

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBQt9I_OSoUuTM61F-JXNBkD98f7PCJcA",
  authDomain: "mountainstatemiles-1326f.firebaseapp.com",
  databaseURL: "https://mountainstatemiles-1326f-default-rtdb.firebaseio.com",
  projectId: "mountainstatemiles-1326f",
  storageBucket: "mountainstatemiles-1326f.firebasestorage.app",
  messagingSenderId: "605911511756",
  appId: "1:605911511756:web:0e99071a816f0a39210869",
  measurementId: "G-N3DNFRQNF9"
};

// Initialize Firebase (using compat version for script tags)
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const database = firebase.database();

// Make database available globally
window.firebaseDatabase = database;
window.firebaseApp = app;

