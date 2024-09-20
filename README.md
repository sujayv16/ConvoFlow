# ConvoFlow

**Tagline:** Connect, Communicate, Collaborate

## Author Information
Viswanadhapalli Sujay  
IIT Jodhpur  
Computer Science and Engineering

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgements](#acknowledgements)

## Introduction

Convoflow is a messaging service prototype designed to deliver a seamless real-time communication experience. It utilizes Socket.io for instant messaging and incorporates WebRTC for video calls, with user data secured through encryption in MongoDB.

## Features

- Sleek and user-friendly interface
- Comprehensive user registration and authentication
- Real-time messaging with typing indicators
- Direct text communication between users
- One-on-one messaging
- User search functionality
- Group chat creation and management
- Real-time message updates
- In-app notifications
- Group user management (add/remove)
- User profile viewing
- Secure login with password encryption
- Persistent chat history
- Fully responsive design
- AI-powered chatbot
- Emoji support
- Video calling feature
- Timestamp for message delivery

## Technologies Used

- **Client:** React.js
- **Server:** Node.js, Express.js
- **Database:** MongoDB

## Installation

To set up and run the Convoflow messaging service prototype locally, please follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version 14 or higher)
- **npm** (Node package manager, comes with Node.js)
- **MongoDB account** (for database setup)

### Environment Variables

Before running the project, you need to configure the following environment variables in a `.env` file located in the root directory of the project:

```
PORT=5000
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret Key>
NODE_ENV=production
```

- **PORT**: The port on which your server will run.
- **MONGO_URI**: This can be generated from your MongoDB project profile.
- **JWT_SECRET**: You can name this variable whatever you want; it’s used for signing JWT tokens.
- **NODE_ENV**: Set this to `production`.

### Steps to Run Locally

1. **Clone the Project**  
   Open your terminal and run the following command to clone the Convoflow repository:

   ```
   git clone https://github.com/sujayv16/ConvoFlow
   ```

2. **Navigate to the Project Directory**  
   Change to the newly cloned project directory:

   ```
   cd ConvoFlow
   ```

3. **Install Backend Dependencies**  
   Install the required dependencies for the backend:

   ```
   npm install
   ```

4. **Install Frontend Dependencies**  
   Move to the frontend directory and install its dependencies:

   ```
   cd frontend/
   npm install
   ```

5. **Start the Application**  
   Return to the main project directory:

   ```
   cd ..
   ```

   Then, start both the client and server simultaneously:

   ```
   npm run start
   ```

### Usage

After running the above command, your application should be up and running, accessible via `http://localhost:5000`.

Make sure your MongoDB server is running for the application to function correctly.

### Acknowledgements

I would like to thank "I'm Beside You" for the opportunity to work on this project. This assignment has provided invaluable experience in developing a real-world application and allowed me to apply my skills in a practical setting.

