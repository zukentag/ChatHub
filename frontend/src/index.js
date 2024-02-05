import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react"; // UI Component Library
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom"; // For Multiple Pages

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ChatProvider>
          <App />
          {/* <p>as</p> */}
        </ChatProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
