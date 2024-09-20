import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatContextProvider";
import SideDrawer from "../components/navigation/SideDrawer";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { useState } from "react";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <Box
            width="100%"
            minHeight="100vh"
            backgroundColor="#A7BBCB" // Primary Background Color
        >
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                height="91.5vh"
                padding="10px"
                backgroundColor="#24344D" // Secondary Background Color
                color="#FFFFFF" // Text Color for Dark Backgrounds
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </Box>
    );
};

export default ChatPage;
