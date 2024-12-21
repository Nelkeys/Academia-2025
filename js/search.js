import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt8ZEJDI7wfi0jvQDY4qMx49MMtE1in_E",
    authDomain: "academia-56566.firebaseapp.com",
    projectId: "academia-56566",
    storageBucket: "academia-56566.appspot.com",
    messagingSenderId: "578752731789",
    appId: "1:578752731789:web:dbd67a93d25d095d5b60c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');

    if (query) {
        console.log('Query:', query); // Debugging: log the query parameter

        // Set the document title to "query - Academia"
        document.title = `${query} - Academia`;

        // Set the input value to the search query
        if (searchInput) {
            searchInput.value = query;
        }

        const searchQuery = query.toLowerCase();

        try {
            const articlesRef = collection(db, 'articles');
            const querySnapshot = await getDocs(articlesRef);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const filteredResults = data.filter(article => {
                const topic = article.topic ? article.topic.toLowerCase() : '';
                const snippet = article.snippet ? article.snippet.toLowerCase() : '';
                const author = article.author ? article.author.toLowerCase() : '';

                return topic.includes(searchQuery) || snippet.includes(searchQuery) || author.includes(searchQuery);
            });

            const sortedResults = filteredResults.sort((a, b) => {
                const aTopic = a.topic ? a.topic.toLowerCase() : '';
                const bTopic = b.topic ? b.topic.toLowerCase() : '';

                if (aTopic.includes(searchQuery) && !bTopic.includes(searchQuery)) {
                    return -1;
                }
                if (!aTopic.includes(searchQuery) && bTopic.includes(searchQuery)) {
                    return 1;
                }
                return 0;
            });

            resultsContainer.innerHTML = '';

            if (sortedResults.length > 0) {
                sortedResults.forEach(article => {
                    const articleDiv = document.createElement('div');
                    articleDiv.classList.add('article');
                    articleDiv.setAttribute('data-aos', 'fade-right');
                    articleDiv.setAttribute('data-aos-duration', '1000');

                    // Author Section with Image
                    const authorDiv = document.createElement('div');
                    authorDiv.classList.add('flex', 'gap-2', 'items-center');

                    const authorImage = document.createElement('img');
                    authorImage.src = article.authorImage || '/assets/default-image.png';
                    authorImage.alt = article.author || 'Unknown Author';
                    authorImage.classList.add('w-8', 'h-8', 'rounded-full');

                    const authorDetailsDiv = document.createElement('div');
                    const authorName = document.createElement('p');
                    authorName.classList.add('font-normal');
                    authorName.textContent = article.author || 'Unknown Author';

                    const authorDate = document.createElement('p');
                    authorDate.classList.add('text-[#424242]', 'text-xs');
                    authorDate.textContent = article.date || 'No date available';

                    authorDetailsDiv.appendChild(authorName);
                    authorDetailsDiv.appendChild(authorDate);
                    authorDiv.appendChild(authorImage);
                    authorDiv.appendChild(authorDetailsDiv);

                    // Topic (h3) - Make the topic clickable
                    const topicElement = document.createElement('h3');
                    topicElement.classList.add('text-lg', 'font-normal', 'text-blue-700', 'poppins');
                    const topicLink = document.createElement('a');
                    topicLink.href = `/view?id=${article.id}`; // Link to the view page with articleId as a query parameter
                    topicLink.textContent = article.topic || 'No Topic';
                    topicLink.classList.add('hover:text-blue-500');
                    topicElement.appendChild(topicLink);

                    // Snippet (p)
                    const snippetElement = document.createElement('p');
                    snippetElement.classList.add('text-[#424242]', 'text-sm');
                    snippetElement.textContent = article.snippet || 'No snippet available';

                    // Append all elements to the article div
                    articleDiv.appendChild(authorDiv);
                    articleDiv.appendChild(topicElement);
                    articleDiv.appendChild(snippetElement);

                    // Append the article div to the results container
                    resultsContainer.appendChild(articleDiv);
                });
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>An error occurred while fetching the data.</p>';
        }
    }
});
