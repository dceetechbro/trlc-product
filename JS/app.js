"use strict";

/* DOM ELEMENTS */

import { db } from "./firebase.js";
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


/* FADE-UP ANIMATION */

const animatedElements = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },

    {

        threshold: 0.15

    }

);

animatedElements.forEach(element => {

    observer.observe(element);

});


/* CURRENT YEAR */

const year = document.getElementById("currentYear");

if (year) {

    year.textContent = new Date().getFullYear();

}


/* PREVENT MULTIPLE SUBMISSIONS */

document.querySelectorAll("form").forEach(form => {

    form.addEventListener("submit", () => {

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.classList.add("loading");

            submitButton.textContent = "Processing...";

        }

    });

});


/* APPLICATION INITIALIZATION */

function initializeApplication() {

    console.log(
        "%cTRLC Application Initialized",
        "color:#0B6E4F;font-weight:bold;font-size:14px;"
    );

}

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);

/* BACK TO TOP */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        backToTop.style.display = "grid";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});
