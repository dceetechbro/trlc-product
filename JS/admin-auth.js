import { auth } from "./firebase.js";

import {

signInWithEmailAndPassword,

onAuthStateChanged,

signOut

}

from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

const dashboard = document.getElementById("dashboard");

const loginBox = document.getElementById("loginBox");

loginForm?.addEventListener("submit", async (e)=>{

e.preventDefault();

const email=document.getElementById("adminEmail").value;

const password=document.getElementById("adminPassword").value;

await signInWithEmailAndPassword(

auth,

email,

password

);

});

onAuthStateChanged(auth,user=>{

if(user){

loginBox.style.display="none";

dashboard.style.display="block";

}else{

loginBox.style.display="block";

dashboard.style.display="none";

}

});

document.getElementById("logout")?.addEventListener("click",()=>{

signOut(auth);

});