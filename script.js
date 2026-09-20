const micButton = document.getElementById("micButton");
const statusText = document.getElementById("status");
const conversation = document.getElementById("conversation");
const orb = document.getElementById("orb");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (!SpeechRecognition) {

  statusText.textContent =
    "Speech recognition is not supported in this browser.";

} else {

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  micButton.addEventListener("click", () => {

    try {

      recognition.start();

      statusText.textContent = "Listening...";
      orb.classList.add("listening");

    } catch (error) {

      console.log(error);

    }

  });

  recognition.onresult = async (event) => {

    const transcript =
      event.results[0][0].transcript;

    addMessage(transcript, "user");

    statusText.textContent = "Thinking...";

    await askAI(transcript);

  };

  recognition.onend = () => {

    orb.classList.remove("listening");

  };

  recognition.onerror = (event) => {

    console.log("Speech error:", event.error);

    orb.classList.remove("listening");

    statusText.textContent =
      "I couldn't hear that. Try again.";

  };

}

async function askAI(message) {

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message
      })

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    if (data.action) {
      executeAction(data.action);
    }

    addMessage(data.response, "assistant");

    speak(data.response);

    statusText.textContent =
      "Tap the microphone and speak";

  } catch (error) {

    console.error(error);

    const message =
      "Sorry, I couldn't connect to the AI assistant.";

    addMessage(message, "assistant");

    speak(message);

    statusText.textContent =
      "Connection error";

  }

}

function executeAction(action) {

  switch (action) {

    case "open_pricing":

      scrollToSection("pricing");

      break;

    case "open_demo":

      scrollToSection("demo");

      break;

    case "open_features":

      scrollToSection("features");

      break;

    case "go_home":

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      break;

  }

}

function scrollToSection(id) {

  const section =
    document.getElementById(id);

  if (!section) {

    console.warn(
      `Section #${id} was not found.`
    );

    return;

  }

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}

function addMessage(text, type) {

  const message =
    document.createElement("div");

  message.className =
    `message ${
      type === "user"
        ? "user-message"
        : "assistant-message"
    }`;

  message.textContent = text;

  conversation.appendChild(message);

  conversation.scrollTop =
    conversation.scrollHeight;

}

function speak(text) {

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);

}
