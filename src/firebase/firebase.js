import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-tokI9h9aKl_xbepJiaN_xB4Q_5evl4A",
  authDomain: "moodnest-d186d.firebaseapp.com",
  projectId: "moodnest-d186d",
  storageBucket: "moodnest-d186d.firebasestorage.app",
  messagingSenderId: "564785322883",
  appId: "1:564785322883:web:70ca490df4260e6f88b4b6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
