import { Avatar, Box, Text, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { CloseIcon } from '@chakra-ui/icons';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="white" // White background for better contrast
      _hover={{
        background: "#24344D", // Dark background on hover
        color: "white",
        boxShadow: "md", // Add shadow effect on hover
      }}
      w="100%"
      alignItems="center"
      borderRadius="lg"
      p={4} // Increased padding
      mb={2}
      border="1px" // Border to define the item
      borderColor="gray.200" // Light gray border
      transition="0.2s ease" // Smooth transition for hover effects
    >
      <Avatar
        size="lg" // Larger avatar for better visibility
        name={user.name}
        src={user.pic}
        mr={4} // Margin right for spacing
        borderRadius="full" // Full rounded avatar
      />
      <Box flex="1" textAlign="left"> {/* Flex property to fill space */}
        <Text fontWeight="bold" fontSize="lg">{user.name}</Text>
        <Text fontSize="sm" color="gray.600">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
      <IconButton
        aria-label="Remove User"
        icon={<CloseIcon />}
        variant="outline" // Outline button for the close icon
        colorScheme="red"
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the handleFunction
          // Add remove user logic here if needed
        }}
      />
    </Flex>
  );
};

export default UserListItem;
