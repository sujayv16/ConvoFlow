import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ScrollableChat = ({ messages, user }) => {
  return (
    <>
      {messages.map((msg) => (
        <Box
          key={msg._id}
          p={3}
          mb={3}
          borderRadius="lg"
          bg={msg.sender._id === user._id ? "#24344D" : "#E8E8E8"}
          color={msg.sender._id === user._id ? "white" : "#24344D"}
          alignSelf={msg.sender._id === user._id ? "flex-end" : "flex-start"}
          maxWidth="80%"
          wordBreak="break-word"
        >
          <Text mb={1}>
            {msg.content}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign={msg.sender._id === user._id ? "right" : "left"}>
            {formatDate(msg.createdAt)}
          </Text>
        </Box>
      ))}
    </>
  );
};

export default ScrollableChat;
