import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const tools = [
  {
    type: "function",
    name: "open_pricing",
    description:
      "Scroll the MenuBoxGh website to the pricing section. Use this when the user asks to see, open, or go to pricing.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    type: "function",
    name: "open_demo",
    description:
      "Scroll the MenuBoxGh website to the demo section. Use this when the user asks to see, open, or watch the demo.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    type: "function",
    name: "open_features",
    description:
      "Scroll the MenuBoxGh website to the features section.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    type: "function",
    name: "go_home",
    description:
      "Scroll the MenuBoxGh website back to the top.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

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
        error: "Message is required"
      });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: `
You are the voice assistant for MenuBoxGh.

MenuBoxGh is a digital restaurant menu and ordering platform.

Be concise and natural because your responses will be spoken aloud.

You can answer questions about MenuBoxGh.

When the user asks you to navigate the website, use the appropriate function.

User request:
${message}
`,
      tools
    });

    const functionCall = interaction.steps.find(
      step => step.type === "function_call"
    );

    if (functionCall) {
      return res.status(200).json({
        type: "action",
        action: functionCall.name,
        response: getActionResponse(functionCall.name)
      });
    }

    const modelOutput = interaction.steps
      .filter(step => step.type === "model_output")
      .flatMap(step => step.content || [])
      .filter(content => content.type === "text")
      .map(content => content.text)
      .join(" ");

    return res.status(200).json({
      type: "message",
      response:
        modelOutput ||
        "I couldn't generate a response."
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "The AI assistant encountered an error."
    });
  }
}

function getActionResponse(action) {
  switch (action) {
    case "open_pricing":
      return "Opening the pricing section.";

    case "open_demo":
      return "Opening the demo.";

    case "open_features":
      return "Opening the features section.";

    case "go_home":
      return "Taking you back to the top.";

    default:
      return "Done.";
  }
        }
