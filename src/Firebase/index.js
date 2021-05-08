import firebase from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDYsGreUx-uAHV5sDv6YhiuSEd3k95WkDE',
  authDomain: 'fsparty-d0c16.firebaseapp.com',
  databaseUrl: 'https://fsparty-d0c16-default-rtdb.firebaseio.com/',
  projectId: 'fsparty-d0c16',
  storageBucket: 'fsparty-d0c16.appspot.com',
  messagingSenderId: '746505029214',
  appId: '1:746505029214:web:d7758bf54cf255865596cf',
  measurementId: 'G-JEVNY56SEG',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
// if (location.hostname === 'localhost') {
//   // Point to the RTDB emulator running on localhost.
//   database.useEmulator('localhost', 9000);
// }

// ------- test functions --------

// read from database once
// export function getReference() {
//   let db = database.ref();
//   const data = usersRef
//     .child('players')
//     .get()
//     .then((snapshot) => {
//       console.log(snapshot.val());
//     });

//   return data;
// }

// update database - not working perfectly

function setData(name) {
  database.ref('users').update({
    name,
  });
}

setData('david');
setData('reid');

export const players = database.ref('players');

// set up listener for changes to 'users' scope of database
// users.on('value', (snapshot) => {
//   userData.push(snapshot.val());
//   console.log(userData);
// });
