import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDhuL1yZLe6Fh1wvmoP0oPOP0dXEcqjl_c",
	authDomain: "house-market-place-a5406.firebaseapp.com",
	projectId: "house-market-place-a5406",
	storageBucket: "house-market-place-a5406.appspot.com",
	messagingSenderId: "68776307046",
	appId: "1:68776307046:web:60e0a641b239b775c240a7",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
