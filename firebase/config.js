// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDeEyU-HG69togVCeK03TKJSQTyd4_bB6I",
  authDomain: "goit-react-native-hw-f0a5c.firebaseapp.com",
  projectId: "goit-react-native-hw-f0a5c",
  storageBucket: "goit-react-native-hw-f0a5c.appspot.com",
  messagingSenderId: "191998561558",
  appId: "1:191998561558:web:17b956aec7c212d0be9437",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth Firebase
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
