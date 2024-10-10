// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importar Firestore

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializa la aplicación de Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializa la autenticación
const auth = getAuth(firebaseApp);

// Inicializa Firestore
const db = getFirestore(firebaseApp); // Inicializar Firestore

// Exportar autenticación y Firestore
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, db }; // Asegúrate de exportar db
