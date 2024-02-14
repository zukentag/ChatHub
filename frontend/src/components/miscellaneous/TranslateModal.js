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
import { Spinner } from "@chakra-ui/react";

let speak = false;
const TranslateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fromLanguage, setFromLanguage] = useState("en-GB");
  const [toLanguage, setToLanguage] = useState("hi-IN");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copiedFrom, setCopiedFrom] = useState(false);
  const [copiedTo, setCopiedTo] = useState(false);
  const [volumeFrom, setVolumeFrom] = useState(false);
  const [volumeTo, setVolumeTo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handelClose = () => {
    onClose();
    setInputText("");
    setOutputText("");
  };
  const handleCopy = (e, dist) => {
    navigator.clipboard.writeText(e);
    if (dist === "from") {
      setCopiedFrom(true);
      setTimeout(() => setCopiedFrom(false), 1000);
    } else {
      setCopiedTo(true);
      setTimeout(() => setCopiedTo(false), 1000);
    }
  };

  const handleVolume = (e, lang, dist) => {
    let utterance = null;

    utterance = new SpeechSynthesisUtterance(e);
    utterance.lang = lang;

    if (utterance !== null) {
      speechSynthesis.speak(utterance);
    }
    if (dist === "from") {
      setVolumeFrom(true);
      setTimeout(() => setVolumeFrom(false), 1000);
    } else {
      setVolumeTo(true);
      setTimeout(() => setVolumeTo(false), 1000);
    }
  };

  const handelTranslate = async (e) => {
    e.preventDefault();
    setLoading(true);
    speak = false;
    let text = inputText.trim(),
      translateFrom = fromLanguage,
      translateTo = toLanguage;

    if (!text) return;
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    await fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setOutputText(data.responseData.translatedText);
      });
    setLoading(false);
  };

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
        <Modal isOpen={isOpen} onClose={handelClose} size={"xl"}>
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
                    // placeholder={loading?"tran":"Translation"}
                    value={outputText}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <IconButton
                      mr={2}
                      aria-label="Speak input"
                      onClick={() => {
                        handleVolume(inputText, fromLanguage, "from");
                      }}
                      icon={
                        !volumeFrom ? (
                          <Volume2 size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                    <IconButton
                      aria-label="Copy input"
                      onClick={() => handleCopy(inputText, "from")}
                      icon={
                        !copiedFrom ? (
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
                        handleVolume(outputText, toLanguage, "to");
                      }}
                      icon={
                        !volumeTo ? (
                          <Volume2 size={28} strokeWidth={0.5} />
                        ) : (
                          <Check size={28} strokeWidth={0.5} />
                        )
                      }
                    />
                    <IconButton
                      aria-label="Copy input"
                      onClick={() => handleCopy(outputText, "to")}
                      icon={
                        !copiedTo ? (
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
              <Button
                type="button"
                colorScheme="blue"
                marginTop={1}
                onClick={handelTranslate}
              >
                {loading ? <Spinner /> : "Translate Text"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default TranslateModal;
