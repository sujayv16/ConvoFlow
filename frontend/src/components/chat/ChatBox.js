import React from 'react';
import { ChatState } from "../../Context/ChatContextProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={4}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="md"
      maxH="90vh"
      overflowY="auto"
      marginTop={{ base: "4", md: "0" }}
      bg="#A7BBCB" // Fallback background color
      bgImage="url('frontend\src\components\bg_chat.jpg')" // Ensure this path is correct
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover" // Ensures the image covers the entire box
    >
      {selectedChat && (
        <SingleChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          selectedChat={selectedChat} // Pass the selected chat as a prop
        />
      )}
    </Box>
  );
};

export default ChatBox;
