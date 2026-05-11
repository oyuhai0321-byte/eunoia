import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBWw8VYC1DyiW6Fv5AMcNy8oSdipZJ4Fo0",
  authDomain: "eunoia-ef7c8.firebaseapp.com",
  projectId: "eunoia-ef7c8",
  storageBucket: "eunoia-ef7c8.firebasestorage.app",
  messagingSenderId: "765595838743",
  appId: "1:765595838743:web:d5ebef12305a3ecd4b6f52"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
