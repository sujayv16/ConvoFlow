import React, { useEffect, useState } from "react";
import { ChatState } from '../../Context/ChatContextProvider';
import { Box, Text, FormControl, IconButton, Input, Spinner, useToast, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../../config/ChatUtilities';
import ProfileModal from "../User/UserProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatpopup";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../assets/typinganimation.json";
import EmojiPicker from 'emoji-picker-react';
import bgChat from '../../assets/bg_chat.jpg'; // Adjust the path accordingly

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async () => {
    if (newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const onEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
  };

  const initiateVideoCall = () => {
    if (selectedChat) {
      // Redirect to the video call page
      window.open(`/video-call/${selectedChat._id}`, '_blank'); // Adjust this as necessary
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="#24344D"
            bg="#A7BBCB"
            borderBottomWidth="1px"
            borderColor="#24344D"
          >
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal fetchMessages={fetchMessages} />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            <Button onClick={initiateVideoCall} colorScheme="blue" ml={2}>
              Start Video Call
            </Button>
          </Text>
          <Box
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            display="flex"
            flexDirection="column"
            background={`linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), url(${bgChat})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          >
            <Box
              display="flex"
              flexDirection="column"
              overflowY="scroll"
              p={3}
              bg="#FFFFFF"
              borderRadius="lg"
              h="80%"
            >
              {loading ? (
                <Spinner size="xl" alignSelf="center" margin="auto" />
              ) : (
                <ScrollableChat messages={messages} user={user} />
              )}
              {isTyping ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Lottie options={defaultOptions} height={40} width={40} />
                </Box>
              ) : null}
            </Box>
            <FormControl mt={3} display="flex" alignItems="center">
              <IconButton
                icon={<span role="img" aria-label="emoji">😀</span>}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <Box position="absolute" bottom="70px" right="20px">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </Box>
              )}
              <Input
                variant="filled"
                bg="#E8E8E8"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
                borderRadius="md"
                _focus={{ borderColor: "#24344D" }}
                color="#24344D"
              />
              <Button
                onClick={sendMessage}
                ml={2}
                bg="#24344D"
                color="#FFFFFF"
                _hover={{ bg: "#345678" }}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color="#24344D"
          fontSize="30px"
        >
          Click on a user to start chatting
        </Box>
      )}
    </>
  );
};

export default SingleChat;
