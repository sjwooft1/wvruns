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
try {
  // Check if Firebase is already initialized
  let app;
  if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  
  // Analytics is optional and may not be available in compat version
  try {
    if (firebase.analytics) {
      firebase.analytics();
    }
  } catch (analyticsError) {
    console.warn('Analytics not available:', analyticsError);
  }
  
  const database = firebase.database();

  // Make database available globally
  window.firebaseDatabase = database;
  window.firebaseApp = app;
  
  console.log('Firebase initialized successfully');
  console.log('Database reference:', database);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a mock database object to prevent errors
  window.firebaseDatabase = {
    ref: function(path) {
      return {
        once: function() {
          return Promise.resolve({
            val: function() { return null; },
            forEach: function() {},
            exists: function() { return false; },
            numChildren: function() { return 0; }
          });
        },
        orderByChild: function() { return this; },
        equalTo: function() { return this; },
        limitToFirst: function() { return this; },
        limitToLast: function() { return this; },
        push: function() { return this; },
        set: function() { return Promise.resolve(); },
        update: function() { return Promise.resolve(); },
        remove: function() { return Promise.resolve(); }
      };
    }
  };
}

