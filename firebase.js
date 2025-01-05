import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyCcMDFOPceKG2ayD2k3Ijvb9t3KcENwTmc",
    authDomain: "ai-writer-36278.firebaseapp.com",
    projectId: "ai-writer-36278",
    storageBucket: "ai-writer-36278.firebasestorage.app",
    messagingSenderId: "399723950608",
    appId: "1:399723950608:web:cc739a7fa07d7a4db4d095",
    measurementId: "G-31Y5DLHT2G"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
