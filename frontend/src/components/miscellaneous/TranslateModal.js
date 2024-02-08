import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  Flex,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { Languages, XCircle, Volume2, Copy, Repeat, Check } from "lucide-react";

let speak = false;
const TranslateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fromLanguage, setFromLanguage] = useState("en-GB");
  const [toLanguage, setToLanguage] = useState("hi-IN");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [volume, setVolume] = useState(false);

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleVolume = (e, lang) => {
    let utterance = null;

    utterance = new SpeechSynthesisUtterance(e);
    utterance.lang = lang;

    if (utterance !== null) {
      speechSynthesis.speak(utterance);
    }
    setVolume(true);
    setTimeout(() => setVolume(false), 1000);
  };

  const fromText = document.querySelector(".from-text");
  const toText = document.querySelector(".to-text");
  const exchageIcon = document.querySelector(".exchange");

  const selectTag = document.querySelectorAll("select");
  const icons = document.querySelectorAll(".row i");
  const translateBtn = document.querySelector(".translate");

  if (exchageIcon !== null) {
    exchageIcon.addEventListener("click", () => {
      let tempText = fromText.value,
        tempLang = selectTag[0].value;
      fromText.value = toText.value;
      toText.value = tempText;
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    });
  }

  if (fromText !== null) {
    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });
  }

  if (translateBtn !== null) {
    translateBtn.addEventListener("click", () => {
      speak = false;
      let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      const url = fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
          toText.setAttribute("placeholder", "Translation");
        });
    });
  }

  icons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      if (e.stopPropagation) e.stopPropagation();
      e.preventDefault(); // Prevent default action

      const { target } = e;

      if (!fromText.value || !toText.value) return;

      if (target.classList.contains("fa-copy")) {
        if (target.id == "from") {
          navigator.clipboard.writeText(fromText.value);
        } else {
          navigator.clipboard.writeText(toText.value);
        }
      } else {
        let utterance;
        if (target.id == "from") {
          utterance = new SpeechSynthesisUtterance(fromText.value);
          utterance.lang = selectTag[0].value;
        } else {
          utterance = new SpeechSynthesisUtterance(toText.value);
          utterance.lang = selectTag[1].value;
        }
        if (utterance !== null && !speak) {
          console.log(utterance);
          speechSynthesis.speak(utterance);
          utterance = null;
          speak = true;
          // window.reload();
          // window.location.reload();
        }
      }
    });
  });

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
            <Languages color="white" size={24} />
          ) : (
            <XCircle color="white" size={20} />
          )}
        </IconButton>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              backgroundColor="#5372f0"
              textAlign={"center"}
              fontSize={24}
              fontWeight={700}
            >
              Translate
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column">
                <Flex justify="space-between" mb={4}>
                  <Textarea
                    width={500}
                    height={300}
                    spellCheck="false"
                    className="from-text"
                    placeholder="Enter text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Textarea
                    width={500}
                    height={300}
                    spellCheck="false"
                    readOnly
                    disabled
                    className="to-text"
                    placeholder="Translation"
                    value={outputText}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <IconButton
                      mr={2}
                      aria-label="Speak input"
                      onClick={() => {
                        handleVolume(inputText, fromLanguage);
                      }}
                      icon={
                        !volume ? (
                          <Volume2 size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                    <IconButton
                      aria-label="Copy input"
                      onClick={() => handleCopy(inputText)}
                      icon={
                        !copied ? (
                          <Copy size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                  </Flex>
                  <Select
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                  >
                    <option value="en-GB">English</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="fr-FR">French</option>
                  </Select>
                  <IconButton
                    aria-label="Exchange languages"
                    onClick={() => {
                      let from = fromLanguage;
                      let to = toLanguage;
                      setFromLanguage(to);
                      setToLanguage(from);
                    }}
                  >
                    <Repeat size={28} strokeWidth={0.5} />
                  </IconButton>
                  <Select
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                  >
                    <option value="hi-IN">Hindi</option>
                    <option value="en-GB">English</option>
                    <option value="fr-FR">French</option>
                  </Select>
                  <Flex align="center">
                    <IconButton
                      mr={2}
                      aria-label="Speak input"
                      onClick={() => {
                        handleVolume(outputText, toLanguage);
                      }}
                      icon={
                        !volume ? (
                          <Volume2 size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                    <IconButton
                      aria-label="Copy input"
                      onClick={() => handleCopy(outputText)}
                      icon={
                        !copied ? (
                          <Copy size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
            <ModalFooter display={"flex"} justifyContent={"center"}>
              <Button class="translate" backgroundColor="#5372f0">
                Translate Text
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default TranslateModal;
