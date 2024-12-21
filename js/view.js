import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt8ZEJDI7wfi0jvQDY4qMx49MMtE1in_E",
  authDomain: "academia-56566.firebaseapp.com",
  projectId: "academia-56566",
  storageBucket: "academia-56566.appspot.com",
  messagingSenderId: "578752731789",
  appId: "1:578752731789:web:dbd67a93d25d095d5b60c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id"); // Get article ID from URL

  console.log("Article ID from URL: ", articleId); // Log articleId for debugging

  if (articleId) {
    try {
      // Get article data from Firestore by document ID
      const articleRef = doc(db, "articles", articleId);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        const article = articleSnap.data();
        console.log("Fetched article:", article); // Log fetched article data

        // Update the page with the article details
        document.getElementById("query").textContent =
          article.topic
        document.getElementById("author").textContent =
          article.author || "Unknown Author";
        document.getElementById("date").textContent =
          article.date
        document.getElementById("fullNote").innerHTML =
          article.full_note || "No content available";
        document.getElementById("authorImage").src =
          article.authorImage || "/assets/default-image.png";

        // Set the document title to "topic - Academia"
        document.title = `${article.topic} - Academia`;
      } else {
        // If the article is not found
        document.getElementById("fullNote").innerHTML =
          "<p>Article not found.</p>";
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      document.getElementById("fullNote").innerHTML =
        "<p>An error occurred while fetching the article.</p>";
    }
  } else {
    // If no article ID is provided
    document.getElementById("fullNote").innerHTML =
      "<p>No article specified.</p>";
  }
});
