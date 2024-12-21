document.addEventListener("DOMContentLoaded", function () {
  async function fetchAIResponse() {
    const query = document.getElementById("search-input").value;

    if (!query) {
      alert("Please enter a search term");
      return;
    }

    try {
      const response = await fetch("/api/fetchAIResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Log the API response to debug
      console.log("API response:", data);

      // Get the ai-feedback element
      const aiFeedback = document.getElementById("ai-feedback");
      if (aiFeedback) {
        if (data.result) {
          // Clean and format the AI response
          let formattedResponse = data.result;

          formattedResponse = formattedResponse
            .replace(/^###\s+/gm, '<h3 class="text-base font-semibold">') // Replace ### with h3 and smaller text
            .replace(
              /\*\*\*(.*?)\*\*\*/g,
              '<strong class="text-sm">$1</strong>'
            ) // Replace *** with strong (bold) and smaller text
            .replace(/\*(.*?)\*/g, '<em class="text-sm">$1</em>') // Replace * with em (italic) and smaller text
            .replace(/\n/g, "<br>"); // Replace newlines with <br>

          // Inject the cleaned HTML into the feedback element
          aiFeedback.innerHTML = formattedResponse;
        } else {
          aiFeedback.innerText = "No result available";
        }
      } else {
        console.error("Element with id 'ai-feedback' not found!");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const aiFeedback = document.getElementById("ai-feedback");
      if (aiFeedback) {
        aiFeedback.innerText = `Error: ${error.message}`;
      }
    }
  }

  // Optionally call this function when the search input is focused or on page load
  fetchAIResponse(); // Call this on page load or based on specific events
});
