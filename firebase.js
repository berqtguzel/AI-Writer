import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime Database için import

// Firebase yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyCcMDFOPceKG2ayD2k3Ijvb9t3KcENwTmc",
    authDomain: "ai-writer-36278.firebaseapp.com",
    projectId: "ai-writer-36278",
    databaseURL: "https://ai-writer-36278-default-rtdb.firebaseio.com", // Realtime Database URL
    messagingSenderId: "399723950608",
    appId: "1:399723950608:web:cc739a7fa07d7a4db4d095",
    measurementId: "G-31Y5DLHT2G"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Authentication modülü
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Realtime Database modülü
const database = getDatabase(app);

export { auth, googleProvider, database };
