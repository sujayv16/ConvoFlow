import React, { useEffect } from 'react';
import { Container, Box, Tabs, Tab, TabPanels, TabList, TabPanel } from "@chakra-ui/react";
import Login from "../components/authentication/Loginform";
import SignUp from '../components/authentication/Signupform';
import { useHistory } from "react-router";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="container.md" centerContent>
      <Box
        bg="white"
        w="100%"
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="lg"
        mt="20vh" // Adjust margin-top to center vertically
        mb={10}
    >
      <Tabs variant='soft-rounded' colorScheme='blue'>
        <TabList>
          <Tab width="50%">Login</Tab>
          <Tab width="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login />
          </TabPanel>
          <TabPanel>
            <SignUp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container>
  );
};

export default HomePage;
