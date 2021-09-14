import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyCfFKI23oZ6LCIOBtEOtE71Yvkv9bbH1AY",
    authDomain: "webapp-54d1c.firebaseapp.com",
    projectId: "webapp-54d1c",
    storageBucket: "webapp-54d1c.appspot.com",
    messagingSenderId: "256232853293",
    appId: "1:256232853293:web:bd8239569a653201404da4"
};
  
// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export default firebase;