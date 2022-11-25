import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDzbaYF7sqQUhS8fU8m4PZM3RlnK83H4L8",
    authDomain: "edfs-b732d.firebaseapp.com",
    databaseURL: "https://edfs-b732d-default-rtdb.firebaseio.com",
    projectId: "edfs-b732d",
    storageBucket: "edfs-b732d.appspot.com",
    messagingSenderId: "277169660583",
    appId: "1:277169660583:web:541cb7dba76f84d0afb182",
    measurementId: "G-STBE45S793"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

