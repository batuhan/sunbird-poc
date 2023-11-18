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
  const confirmation = confirm(`Delete info for  ${email}?`)
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login failed:", errorMessage);
      alert("Login failed:", errorMessage)
    });
}

let accounts = []

// Check for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    console.log("User is signed out");
    return
  }

  document.getElementById('loginForm').style.display = 'none';
  // User is signed in, execute the code inside the .then block
  console.log("Logged in as:", user.email);

  const userId = user.uid;

  const dbRef = firebase.database().ref(`users/${userId}`);
  dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return
    const pretty = JSON.stringify(data, null, 2);
    console.log('user value', pretty)
    accounts = Object.keys(data.accounts)
    deleteAccount(accounts[0])
    firebase.database().ref(`users/${userId}`).remove();
    document.getElementById('status').innerHTML = 'Nuked user data';
  });
})

function deleteAccount(accountId) {
  const dbRef = firebase.database().ref(`accounts/${accountId}`);

  dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return
    document.getElementById('status').innerHTML = 'Nuked user & account data';
  });
}
