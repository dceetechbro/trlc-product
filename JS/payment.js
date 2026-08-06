/* DONATION SELECTION */
import { db } from "./firebase.js";

import {
    doc,
    onSnapshot,
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const header = document.querySelector(".header");
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-list a");


/* STICKY HEADER */

function handleHeaderScroll() {

    if (!header) return;

    // Don't change the Give page header
    if (header.classList.contains("header-give")) return;

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* MOBILE NAVIGATION */

function toggleNavigation() {

    navbar.classList.toggle("active");

    const expanded =
        navbar.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", expanded);

    menuToggle.innerHTML = expanded ? "✕" : "☰";

}


menuToggle.addEventListener("click", toggleNavigation);


/* CLOSE NAVIGATION AFTER LINK CLICK */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = "☰";

    });

});


/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener("click", (event) => {

    const clickedInsideMenu =
        navbar.contains(event.target);

    const clickedButton =
        menuToggle.contains(event.target);

    if (
        !clickedInsideMenu &&
        !clickedButton &&
        navbar.classList.contains("active")
    ) {

        navbar.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = "☰";

    }

});


/* ESC KEY CLOSES MOBILE MENU */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        navbar.classList.contains("active")
    ) {

        navbar.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = "☰";

    }

});


/* SMOOTH SCROLL */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});


const amountCards = document.querySelectorAll(".amount-card");
const customAmount = document.getElementById("customAmount");
const frequencyButtons = document.querySelectorAll(".frequency-btn");

let selectedAmount = 50000;
let givingFrequency = "once";

amountCards.forEach((card) => {
  card.addEventListener("click", () => {
    amountCards.forEach((item) => item.classList.remove("active"));

    card.classList.add("active");

    const amount = card.dataset.amount;

    if (amount) {
      selectedAmount = Number(amount);

      customAmount.value = amount;
    } else {
      customAmount.focus();
    }
  });
});

customAmount.addEventListener("input", () => {
  amountCards.forEach((card) => card.classList.remove("active"));

  selectedAmount = Number(customAmount.value);
});

frequencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    frequencyButtons.forEach((item) => item.classList.remove("active"));

    button.classList.add("active");

    givingFrequency = button.dataset.frequency;
  });
});

/* PARTNER DATA */

function getPartnerInformation() {
  return {
    fullName: document.getElementById("fullName").value.trim(),

    email: document.getElementById("email").value.trim(),

    phone: document.getElementById("phone").value.trim(),

    prayerRequest: document.getElementById("prayerRequest").value.trim(),

    anonymous: document.getElementById("anonymousGiving").checked,

    amount: selectedAmount,

    frequency: givingFrequency,
  };
}

/* PAYMENT METHODS */

const accounts={

online:{

title:"Online Bank Transfer",

number:"1310352971",

name:"THE RESURRECTED GLOBAL EKKLESIA WORLDWIDE – TRLC",


},

ussd:{

title:"USSD Transfer",

number:"0000000000"

},

zenith:{

title:"Zenith Bank",

number:"1310352971",

name:"THE RESURRECTED GLOBAL EKKLESIA WORLDWIDE – TRLC"

},

// moniepoint:{

// title:"Moniepoint Business",

// number:"",

// name:"THE RESURRECTED GLOBAL EKKLESIA WORLDWIDE"

// }

};

const paymentOptions=document.querySelectorAll(".payment-option");

const bankTitle=document.getElementById("bankTitle");

const accountNumber=document.getElementById("accountNumber");

let selectedMethod="online";

paymentOptions.forEach(option=>{

option.addEventListener("click",()=>{

paymentOptions.forEach(card=>{

card.classList.remove("active");

});

option.classList.add("active");

selectedMethod=option.dataset.method;

bankTitle.textContent=accounts[selectedMethod].title;

accountNumber.textContent=accounts[selectedMethod].number;

});

});

/* COPY ACCOUNT NUMBER */

document
.getElementById("copyAccount")
.addEventListener("click",()=>{

navigator.clipboard.writeText(

accountNumber.textContent

);

const button=

document.getElementById("copyAccount");

button.innerHTML=

'<i class="fa-solid fa-check"></i> Copied';

setTimeout(()=>{

button.innerHTML=

'<i class="fa-regular fa-copy"></i> Copy Account Number';

},2000);

});

/* SHOW CONFIRMATION FORM */

const transferButton =
document.getElementById("transferComplete");

const confirmationSection =
document.getElementById("transferConfirmation");

transferButton.addEventListener("click",()=>{

confirmationSection.scrollIntoView({

behavior:"smooth"

});

document.getElementById("confirmMethod").value =
bankTitle.textContent;

document.getElementById("confirmAmount").value =
selectedAmount;

});

/* PREPARE FIREBASE DATA */

document
.getElementById("confirmationForm")
.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const donation={

        fullName:
        document.getElementById("confirmName").value,

        email:
        document.getElementById("confirmEmail").value,

        phone:
        document.getElementById("confirmPhone").value,

        amount:Number(
        document.getElementById("confirmAmount").value
        ),

        paymentMethod:
        document.getElementById("confirmMethod").value,

        reference:
        document.getElementById("confirmReference").value,

        prayerRequest:
        document.getElementById("confirmPrayer").value,

        anonymous:
        document.getElementById("confirmAnonymous").checked,

        status:"pending",

        createdAt:serverTimestamp()

    };

    try{

        await addDoc(

            collection(db,"donations"),

            donation

        );

        alert(

            "Thank you for partnering with TRLC 2026.\n\nYour confirmation has been received."

        );

        e.target.reset();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});

const campaignRef = doc(
    db,
    "campaign",
    "3Uvlf2mXsveuMgLy9KPz"
);

onSnapshot(campaignRef, (snapshot) => {

    if (!snapshot.exists()) return;

    const campaign = snapshot.data();

    const raised = campaign.raised;
    const target = campaign.target;

    const percentage = ((raised / target) * 100).toFixed(1);

    const amountRaised = document.getElementById("amountRaised");
    const projectBudget = document.getElementById("projectBudget");
    const remainingBudget = document.getElementById("remainingBudget");
    const campaignPercentage = document.getElementById("campaignPercentage");
    const campaignProgress = document.getElementById("campaignProgress");

    if (
        amountRaised &&
        projectBudget &&
        remainingBudget &&
        campaignPercentage &&
        campaignProgress
    ) {

        amountRaised.textContent = raised.toLocaleString();
        projectBudget.textContent = target.toLocaleString();
        remainingBudget.textContent = (target - raised).toLocaleString();
        campaignPercentage.textContent = percentage + "%";
        campaignProgress.style.width = percentage + "%";

    }

});

/* LIVE GIVING FEED */

const liveFeed = document.getElementById("liveFeed");

let verifiedPartners = [];
let currentPartner = 0;

const donationsQuery = query(
    collection(db, "donations"),
    where("status", "==", "verified"),
    orderBy("verifiedAt", "desc"),
    limit(20)
);

onSnapshot(donationsQuery, (snapshot) => {

    verifiedPartners = [];

    snapshot.forEach((doc) => {
        verifiedPartners.push(doc.data());
    });

    currentPartner = 0;

    showPartner();

});

function showPartner() {

    if (verifiedPartners.length === 0) {

        liveFeed.innerHTML =
        "<p>No verified partners yet.</p>";

        return;

    }

    const donation = verifiedPartners[currentPartner];

    const partnerName = donation.anonymous
        ? "Anonymous Partner"
        : donation.fullName;

    liveFeed.innerHTML = `

        <div class="feed-marquee">

            ❤️ ${partnerName}

            partnered with

            <strong>₦${Number(donation.amount).toLocaleString()}</strong>

        </div>

    `;

    currentPartner++;

    if(currentPartner >= verifiedPartners.length){

        currentPartner = 0;

    }

}

setInterval(() => {

    showPartner();

}, 20000);