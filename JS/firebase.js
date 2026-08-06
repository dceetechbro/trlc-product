/* FIREBASE CONFIGURATION */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

import {
    getAuth
}
from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";

/* FIREBASE PROJECT CONFIG */

const firebaseConfig = {

    apiKey: "AIzaSyDN0YuFj4NJFui399-sq_zUjXWlzSglx8k",

    authDomain: "trlc-2026.firebaseapp.com",

    projectId: "trlc-2026",

    storageBucket: "trlc-2026.firebasestorage.app",

    messagingSenderId: "635051107214",

    appId: "1:635051107214:web:2ee47bad068c23427efadf",

    measurementId: "G-BQX5V5ZW0E"

};

/* INITIALIZE FIREBASE */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const analytics = getAnalytics(app);

/* EXPORT SERVICES */

export {

    app,

    db,

    auth,
    
    analytics

};