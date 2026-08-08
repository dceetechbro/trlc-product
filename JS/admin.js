import { app, db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");

const loginScreen = document.getElementById("loginScreen");

const dashboard = document.getElementById("dashboard");

const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");

/* LOGIN */

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginError.textContent = "";

  try {
    await signInWithEmailAndPassword(
      auth,

      document.getElementById("adminEmail").value.trim(),

      document.getElementById("adminPassword").value,
    );
  } catch (error) {
    loginError.textContent = "Authorized Personnel Only.";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginScreen.style.display = "none";

    dashboard.style.display = "block";

    await loadCampaign();
  } else {
    loginScreen.style.display = "flex";

    dashboard.style.display = "none";
  }
});

const campaignRef = doc(db, "campaign", "3Uvlf2mXsveuMgLy9KPz");

// HTML Elements

const campaignForm = document.getElementById("campaignForm");

const title = document.getElementById("title");

const description = document.getElementById("description");

const raised = document.getElementById("raised");

const target = document.getElementById("target");

const status = document.getElementById("status");

// Load current campaign

async function loadCampaign() {
  const snapshot = await getDoc(campaignRef);

  if (snapshot.exists()) {
    const campaign = snapshot.data();

    title.value = campaign.title;

    description.value = campaign.description;

    raised.value = campaign.raised;

    target.value = campaign.target;
  }
}
// Update Firestore

campaignForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const button = campaignForm.querySelector("button");

  button.disabled = true;

  button.textContent = "Updating...";

  status.textContent = "";

  try {
    await updateDoc(campaignRef, {
      title: title.value,

      description: description.value,

      raised: Number(raised.value),

      target: Number(target.value),

      updatedAt: new Date(),
    });

    status.style.color = "#28a745";

    status.textContent = "✓ Campaign updated successfully.";
  } catch (error) {
    console.error(error);

    status.style.color = "#dc3545";

    status.textContent = "Update failed. Please try again.";
  }

  button.disabled = false;

  button.textContent = "Update Campaign";

  setTimeout(() => {
    status.textContent = "";
  }, 3000);
});

const donationList = document.getElementById("donationList");

const donationQuery = query(
  collection(db, "donations"),

  where("status", "==", "pending"),
);

onSnapshot(donationQuery, (snapshot) => {
  donationList.innerHTML = "";

  if (snapshot.empty) {
    donationList.innerHTML = "<p class='empty-state'>No pending donations.</p>";

    return;
  }

  snapshot.forEach((docSnap) => {
    const donation = docSnap.data();

    const card = document.createElement("div");

    card.className = "donation-item";

    card.innerHTML = `

        <div class="donation-header">

            <div class="donation-name">
                ${donation.fullName}
            </div>

            <span class="donation-status">
                Pending
            </span>

        </div>

        <div class="donation-details">

            <p><strong>Amount:</strong> ₦${Number(donation.amount).toLocaleString()}</p>

            <p><strong>Method:</strong> ${donation.paymentMethod}</p>

            <p><strong>Email:</strong> ${donation.email}</p>

            <p><strong>Phone:</strong> ${donation.phone}</p>

        </div>

        <div class="donation-actions">

            <button
                class="verify-btn">
                Verify
            </button>

            <button
                class="reject-btn">
                Reject
            </button>

        </div>

        `;

    /* VERIFY BUTTON */

    const verifyBtn = card.querySelector(".verify-btn");

    verifyBtn.addEventListener("click", async () => {
      verifyBtn.disabled = true;

      verifyBtn.textContent = "Verifying...";

      await verifyDonation(docSnap.id, donation.amount);
    });

    /* REJECT BUTTON */

    const rejectBtn = card.querySelector(".reject-btn");

    rejectBtn.addEventListener("click", async () => {
      rejectBtn.disabled = true;

      rejectBtn.textContent = "Rejecting...";

      await rejectDonation(docSnap.id);
    });
    donationList.appendChild(card);
  });
});

/* VERIFY DONATION */

async function verifyDonation(donationId, amount) {
  try {
    let verifiedDonation = null;

    await runTransaction(db, async (transaction) => {
      const donationRef = doc(db, "donations", donationId);

      const campaignSnapshot = await transaction.get(campaignRef);
      const donationSnapshot = await transaction.get(donationRef);

      if (!campaignSnapshot.exists()) {
        throw new Error("Campaign not found.");
      }

      if (!donationSnapshot.exists()) {
        throw new Error("Donation not found.");
      }

      const donation = donationSnapshot.data();

      if (donation.status === "verified") {
        return;
      }

      const campaign = campaignSnapshot.data();

      const verifiedAt = new Date();

      transaction.update(donationRef, {
        status: "verified",
        verifiedAt: verifiedAt,
      });

      transaction.update(campaignRef, {
        raised: campaign.raised + amount,
        updatedAt: verifiedAt,
      });

      verifiedDonation = {
        fullName: donation.fullName || "",
        amount: Number(donation.amount || amount),
        anonymous: donation.anonymous === true,
        verifiedAt: verifiedAt,
      };
    });

    // Create public-safe live feed entry
    if (verifiedDonation) {
      await addDoc(collection(db, "liveFeed"), verifiedDonation);
    }

    status.style.color = "#28a745";

    status.textContent = "✓ Donation verified successfully.";

    setTimeout(() => {
      status.textContent = "";
    }, 3000);

  } catch (error) {
    console.error(error);

    status.style.color = "#dc3545";

    status.textContent = "✕ Unable to verify donation.";

    setTimeout(() => {
      status.textContent = "";
    }, 3000);
  }
}

async function rejectDonation(donationId) {
  try {
    const donationRef = doc(db, "donations", donationId);

    await updateDoc(donationRef, {
      status: "rejected",

      rejectedAt: new Date(),
    });

    status.style.color = "#dc3545";

    status.textContent = "✗ Donation rejected.";

    setTimeout(() => {
      status.textContent = "";
    }, 3000);
    
  } catch (error) {
    console.error(error);

    status.style.color = "#dc3545";

    status.textContent = "✗ Donation rejected.";

    setTimeout(() => {
      status.textContent = "";
    }, 3000);
  }
}
