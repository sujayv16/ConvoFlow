import { CloseIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Button
      px={4}  // Increased padding for a larger button
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={14} // Slightly larger font size for better readability
      bg="#24344D" // Dark background color
      color="white" // White text color
      _hover={{ bg: "#A7BBCB", color: "#24344D", transform: "scale(1.05)" }} // Scale effect on hover
      _active={{ bg: "#A7BBCB", transform: "scale(0.95)" }} // Scale effect on active click
      cursor="pointer"
      transition="0.2s ease-in-out" // Smooth transition for hover and active states
      leftIcon={<CloseIcon />} // Move the icon to the left of the text
      onClick={handleFunction}
    >
      {user.name}
    </Button>
  );
};

export default UserBadgeItem;
