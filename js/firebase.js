// Import Firebase functions (assuming you're using ES modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmyHXeJtoP8n4dcR-sUEvMFy8jZhbc44c",
    authDomain: "resumes-c098d.firebaseapp.com",
    projectId: "resumes-c098d",
    storageBucket: "resumes-c098d.appspot.com",
    messagingSenderId: "648478886457",
    appId: "1:648478886457:web:b3da5c3df33f8ce1d71be8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let uploadTask;
let jobTitle = '';
function openForm(title) {
    jobTitle = title; // Store the job title
    document.getElementById("jobTitle").value = title; // Pre-fill the job title in the form
    document.getElementById("resumeForm").style.display = "block";
}

function closeForm() {
    document.getElementById("resumeForm").style.display = "none";
    document.getElementById("progress-container").style.display = "none";
    document.getElementById("uploadProgress").value = 0;

    // Show all buttons again after upload or form close
    document.getElementById("submitButton").style.display = "inline-block";
    document.getElementById("closeButton").style.display = "inline-block";
    document.getElementById("skipButton").style.display = "inline-block";
}

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const resumeFile = document.getElementById("resume").files[0];

    // Hide all buttons except the cancel button
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("closeButton").style.display = "none";

    // Show the progress bar and cancel button
    document.getElementById("progress-container").style.display = "block";

    // Create a storage reference
    const storageRef = ref(storage, 'resumes/' + resumeFile.name);

    // Upload the file and show progress
    uploadTask = uploadBytesResumable(storageRef, resumeFile);

    uploadTask.on('state_changed', (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('uploadProgress').value = progress;

    }, (error) => {
        // Handle unsuccessful uploads
        console.error("Error during upload: ", error);
    }, () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
        }).catch((error) => {
            console.error("Error submitting form: ", error);
        });
    });
}

function cancelUpload() {
    if (uploadTask) {
        uploadTask.cancel();
        alert("Upload canceled");
        closeForm();
    }
}

// Attach functions to the window object for global access
window.openForm = openForm;
window.closeForm = closeForm;
window.submitForm = submitForm;
window.cancelUpload = cancelUpload;
