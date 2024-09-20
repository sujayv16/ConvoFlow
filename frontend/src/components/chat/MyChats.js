import React, { useEffect, useState, useCallback } from 'react';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatUtilities';
import GroupChatModal from './GroupChatpopup';
import { ChatState } from '../../Context/ChatContextProvider';
import axios from 'axios';
import bgImage from '../../assets/bg_app.png'; // Importing the background image

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  // Memoize fetchChats to avoid re-creating it on every render
  const fetchChats = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [user.token, setChats, toast]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#A7BBCB"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="#24344D"
      backgroundImage={`url(${bgImage})`} // Setting the background image
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="#24344D"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="#24344D"
            color="white"
            _hover={{ bg: "#1D2A3F" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="white"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#24344D" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "#24344D"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                borderWidth="1px"
                borderColor={selectedChat === chat ? "#A7BBCB" : "transparent"}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
