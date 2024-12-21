import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    console.error("No query provided");
    return res.status(400).json({ error: "Query is required" });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    console.error("API key is missing");
    return res.status(500).json({ error: "API key is missing from environment variables" });
  }

  try {
    console.log(`Calling Hugging Face API with query: ${query}`);

    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-2-2b-it", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `meaning of ${query}`, // Request a brief explanation
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error(`Hugging Face API error: ${response.status} - ${response.statusText}`, errorDetails);
      return res.status(500).json({ error: `Hugging Face API error: ${response.status} - ${response.statusText}`, details: errorDetails });
    }

    const data = await response.json();
    console.log("Hugging Face API response:", data);

    if (data && data.length > 0 && data[0].generated_text) {
      return res.status(200).json({ result: data[0].generated_text });
    } else {
      return res.status(200).json({ result: "No result available" });
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return res.status(500).json({ error: error.message });
  }
}
