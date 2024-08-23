// Import Firebase functions (assuming you're using ES modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Your Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDmyHXeJtoP8n4dcR-sUEvMFy8jZhbc44c",
    authDomain: "resumes-c098d.firebaseapp.com",
    projectId: "resumes-c098d",
    storageBucket: "resumes-c098d.appspot.com",
    messagingSenderId: "648478886457",
    appId: "1:648478886457:web:b3da5c3df33f8ce1d71be8",
    // measurementId: "G-QQWF717J9R"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Functions for form handling
let jobTitle = '';

function openForm(title) {
    jobTitle = title; // Store the job title
    document.getElementById("jobTitle").value = title; // Pre-fill the job title in the form
    document.getElementById("resumeForm").style.display = "block";
}

function closeForm() {
    document.getElementById("resumeForm").style.display = "none";
}

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const resumeFile = document.getElementById("resume").files[0];

    // Upload the resume file to Firebase Storage
    const storageRef = ref(storage, 'resumes/' + resumeFile.name);
    uploadBytes(storageRef, resumeFile).then(snapshot => {
        return getDownloadURL(snapshot.ref);
    }).then(downloadURL => {
        // Store the form data in Firestore
        return addDoc(collection(db, "resumes"), {
            name: name,
            email: email,
            jobTitle: jobTitle,
            resumeURL: downloadURL,
            timestamp: serverTimestamp()
        });
    }).then(() => {
        alert("Resume submitted successfully!");
        closeForm();
    }).catch(error => {
        console.error("Error submitting form: ", error);
    });
}

// Attach functions to the window object for global access
window.openForm = openForm;
window.closeForm = closeForm;
window.submitForm = submitForm;