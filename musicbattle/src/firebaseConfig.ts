import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCaavJkUIje3zkaWvYxMePc14mibJ6Lebo",
    authDomain: "musikkampen.firebaseapp.com",
    databaseURL: "https://musikkampen-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "musikkampen",
    storageBucket: "musikkampen.firebasestorage.app",
    messagingSenderId: "10870804330",
    appId: "1:10870804330:web:5bbbf4e20cd6ec11b2df13"
  };

// 🔥 Initiera Firebase och databasen
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };