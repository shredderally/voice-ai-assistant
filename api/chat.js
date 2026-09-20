export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      apiRoute: true,
      geminiKeyPresent: Boolean(process.env.GEMINI_API_KEY)
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  return res.status(200).json({
    response: "API is working."
  });
}
