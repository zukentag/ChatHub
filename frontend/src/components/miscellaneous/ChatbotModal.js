import { useState } from "react";
import {
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const ChatbotModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userMessage, setUserMessage] = useState(null);
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };

  const handleChat = () => {
    const userMessageValue = userMessage.trim();
    if (!userMessageValue) return;

    chatbox.appendChild(createChatLi(userMessageValue, "outgoing"));

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      callRapidAPI(incomingChatLi);
    }, 600);

    setUserMessage("");
  };

  async function callRapidAPI(chatElement) {
    const messageElement = chatElement.querySelector("p");

    const url = "https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "41bcaab171mshb93ee104e7450a2p1e54d7jsn63fd13e1ddc2",
        "X-RapidAPI-Host": "chatgpt-gpt4-ai-chatbot.p.rapidapi.com",
      },
      body: JSON.stringify({
        query: userMessage.trim(),
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const chatResponse = JSON.parse(result);
      messageElement.textContent = chatResponse.response;
    } catch (error) {
      console.error(error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  }
  return (
    <>
      <div>
        <button class="chatbot-toggler" onClick={onOpen}>
          <span class="material-symbols-outlined">robot</span>
          <span class="material-symbols-outlined">close</span>
        </button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chat Bot</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ul class="chatbox">
                <li class="chat incoming">
                  <span class="material-symbols-outlined">smart_toy</span>
                  <p>
                    Hi there 👋
                    <br />
                    How can I help you today?
                  </p>
                </li>
              </ul>
              <div class="chat-input">
                <Input
                  placeholder="Enter a message..."
                  spellCheck={false}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                />
              </div>

              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleChat}
                justifyContent="center"
              >
                Send
              </Button>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default ChatbotModal;
