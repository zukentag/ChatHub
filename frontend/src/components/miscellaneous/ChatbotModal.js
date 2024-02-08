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
  Container,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { Bot, XCircle } from "lucide-react";

const apiUrl = process.env.REACT_APP_CONTENT_TYPE;
const rapidAPIKey = process.env.REACT_APP_X_RAPIDAPI_KEY;
const rapidAPIHost = process.env.REACT_APP_X_RAPIDAPI_HOST;

const ChatbotModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userMessage, setUserMessage] = useState(null);
  const chatbox = document.querySelector(".chatbox");

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

    const url = apiUrl;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": rapidAPIKey,
        "X-RapidAPI-Host": rapidAPIHost,
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
        <IconButton
          backgroundColor={"#724ae8"}
          borderRadius={"50"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={onOpen}
          _hover={{ backgroundColor: "#5372f0" }}
        >
          {!isOpen ? (
            <Bot color="white" size={24} />
          ) : (
            <XCircle color="white" size={20} />
          )}
        </IconButton>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              backgroundColor="#5372f0"
              textAlign={"center"}
              fontSize={24}
              fontWeight={700}
            >
              Chat Bot
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody marginTop={2}>
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
                  marginTop={10}
                  marginBottom={2}
                  placeholder="Ask me anything..."
                  spellCheck={false}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                />
              </div>
              <Container justifyContent={"right"} display="flex">
                <Button
                  marginTop={2}
                  colorScheme="blue"
                  mr={3}
                  onClick={handleChat}
                  justifyContent="center"
                >
                  Ask
                </Button>
              </Container>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default ChatbotModal;
