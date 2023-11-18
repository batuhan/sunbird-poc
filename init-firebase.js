const firebaseConfig = {
  appId: "",
  apiKey: "AIzaSyA5Hvh075ARg0wPQJmbVkIJBp0zlPkVG8M",
  authDomain: "bluebubblemessaging-dev.firebaseapp.com",
  databaseURL: "https://bluebubblemessaging-dev-default-rtdb.firebaseio.com",
  projectId: "bluebubblemessaging-dev",
  storageBucket: "bluebubblemessaging-dev.appspot.com",
  messagingSenderId: "279611981758",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login failed:", errorMessage);
      alert("Login failed:", errorMessage)
    });
}

// Check for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, execute the code inside the .then block
    console.log("Logged in as:", user.email);

    const userId = user.uid;

    // Subscribe to `settings/updates`
    const dbRef = firebase.database().ref(`users/${userId}`);
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const pretty = JSON.stringify(data, null, 2);
      document.getElementById('userDump').innerHTML = pretty;
      const accounts = Object.keys(data.accounts)
      loadAccount(accounts[0])
    });
  } else {
    // User is signed out or session has ended
    console.log("User is signed out");
    // Perform any actions you need when the session ends
  }
});

function loadAccount(accountId) {
  // Subscribe to `settings/updates`
  const dbRef = firebase.database().ref(`accounts/${accountId}`);
  dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const pretty = JSON.stringify(data, null, 2);
    document.getElementById('accountDump').innerHTML = pretty;
  });
}
