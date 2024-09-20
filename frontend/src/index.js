import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./MainApp";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatContextProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChakraProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ChakraProvider>
  </BrowserRouter>,
);
