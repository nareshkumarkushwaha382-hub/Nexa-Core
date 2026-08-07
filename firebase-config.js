/**
 * @file firebase-config.js
 * @description Firebase initialization module.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "nexa-core-bb617.firebaseapp.com",
    databaseURL: "https://nexa-core-bb617-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "nexa-core-bb617",
    storageBucket: "nexa-core-bb617.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
