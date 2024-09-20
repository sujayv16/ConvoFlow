import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Box, Heading } from "@chakra-ui/react";
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (["image/jpg", "image/jpeg", "image/png"].includes(pics.type)) {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "ddy2fv5u2");
            fetch("https://api.cloudinary.com/v1_1/ddy2fv5u2/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select a valid image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
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
        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not match",
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
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
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
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
            px={4}
        >
            <Box
                p={8}
                maxW="400px" // Consistent width with the Login form
                borderRadius="lg"
                boxShadow="md"
                bg="white"
                textAlign="center"
                width="full"
            >
                <Heading as="h2" size="lg" mb={6}>
                    Sign Up
                </Heading>
                <VStack spacing={4} align="stretch">
                    <FormControl id="name" isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </FormControl>

                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="confirmpassword" isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? "text" : "password"}
                                placeholder="Confirm your password"
                                onChange={(e) => setConfirmpassword(e.target.value)}
                                value={confirmpassword}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="pic">
                        <FormLabel>Profile Picture</FormLabel>
                        <Input
                            type="file"
                            p={1.5}
                            accept="image/*"
                            onChange={(e) => postDetails(e.target.files[0])}
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        width="full"
                        mt={4}
                        onClick={submitHandler}
                        isLoading={loading}
                    >
                        Sign Up
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default Signup;
