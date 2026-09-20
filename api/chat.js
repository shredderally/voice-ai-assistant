export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing from Vercel"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: `Gemini ${response.status}: ${data.error?.message || JSON.stringify(data)}`
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      response: answer || "Gemini returned no text."
    });

  } catch (error) {
    return res.status(500).json({
      error: `Server error: ${error.message}`
    });
  }
}
