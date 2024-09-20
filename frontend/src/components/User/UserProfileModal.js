import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Define modern color scheme
    const bgColor = useColorModeValue("#A7BBCB", "#2D3748"); // Light and Dark modes
    const textColor = useColorModeValue("#24344D", "#F7FAFC"); // Light and Dark modes

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                    bg={bgColor}
                    color={textColor}
                    _hover={{ bg: "#B4E5D9", color: "#24344D" }} // Updated hover color
                    aria-label="View Profile"
                />
            )}

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px" bg={bgColor} color={textColor}>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Poppins"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton color="#24344D" />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            alt={user.name}
                            boxShadow="md" // Added shadow for depth
                        />
                        <VStack spacing={2}>
                            <Text
                                fontSize={{ base: "24px", md: "28px" }}
                                fontFamily="Poppins"
                                color={textColor}
                                textAlign="center"
                            >
                                Email: {user.email}
                            </Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg="#24344D"
                            color="white"
                            _hover={{ bg: "#B4E5D9", color: "#24344D" }} // Updated hover color
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
