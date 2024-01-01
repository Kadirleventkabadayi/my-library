import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6SQfAXyTOMgjPs09ruxR2xZ_5JhVXHGM",
  authDomain: "mylibrary-401711.firebaseapp.com",
  projectId: "mylibrary-401711",
  storageBucket: "mylibrary-401711.appspot.com",
  messagingSenderId: "292368235046",
  appId: "1:292368235046:web:535f807842517f2c5b44e7",
  measurementId: "G-9VDTFNCHGR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const storage = getStorage(app);

export const register = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export { auth, provider };

export const db = getFirestore(app);
