import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast({
                title: "Login successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error occurred!",
                description: error.response?.data?.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <Flex direction="column" align="center" justify="center" minH="50vh">
            <Box
                p={8}
                w="full"
                maxW="500px"
                borderRadius="lg"
                boxShadow="md"
                bg="white"
            >
                <VStack spacing={4}>
                    <Heading as="h2" size="lg" textAlign="center" mb={6}>
                        Login to ConvoFlow
                    </Heading>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            focusBorderColor="blue.500"
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                focusBorderColor="blue.500"
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Button
                        colorScheme="blue"
                        width="full"
                        onClick={submitHandler}
                        isLoading={loading}
                    >
                        Login
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
};

export default Login;
