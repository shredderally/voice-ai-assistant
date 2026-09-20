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

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    addMessage(transcript, "user");

    statusText.textContent = "I heard you.";

    respond(transcript);
  };

  recognition.onend = () => {
    orb.classList.remove("listening");

    if (statusText.textContent === "Listening...") {
      statusText.textContent = "Tap the microphone and speak";
    }
  };

  recognition.onerror = (event) => {

    console.log("Speech error:", event.error);

    orb.classList.remove("listening");

    statusText.textContent =
      "I couldn't hear that. Try again.";
  };
}

function addMessage(text, type) {

  const message = document.createElement("div");

  message.className =
    `message ${type === "user"
      ? "user-message"
      : "assistant-message"}`;

  message.textContent = text;

  conversation.appendChild(message);

  conversation.scrollTop =
    conversation.scrollHeight;
}

function respond(text) {

  const lower = text.toLowerCase();

  let response;

  if (
    lower.includes("what is menubox") ||
    lower.includes("what does menubox do")
  ) {

    response =
      "MenuBoxGh helps restaurants create digital menus and receive customer orders.";

  } else if (
    lower.includes("hello") ||
    lower.includes("hi")
  ) {

    response =
      "Hello. What would you like to know about MenuBoxGh?";

  } else if (
    lower.includes("pricing") ||
    lower.includes("price")
  ) {

    response =
      "MenuBoxGh has Standard and Premium plans.";

  } else {

    response =
      "I heard you say: " + text;
  }

  addMessage(response, "assistant");

  speak(response);
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
