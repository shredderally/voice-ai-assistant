export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "No message received"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing from Vercel"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },

        body: JSON.stringify({
          model: "gemini-3.8-flash",

          input: `
You are the MenuBoxGh website voice assistant.

MenuBoxGh is a digital restaurant menu and ordering platform.

Answer the user's question naturally and briefly because your answer will be spoken aloud.

User:
${message}
`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Gemini API request failed"
      });
    }

    return res.status(200).json({
      type: "message",
      response:
        data.output_text ||
        "Gemini returned no text response."
    });

  } catch (error) {

    console.error("Server error:", error);

    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
