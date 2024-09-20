# Convoflow

**Tagline:** Connect, Communicate, Collaborate

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

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

To run this project, you will need to set up environment variables in a `.env` file:

```plaintext
PORT=<your-port-number>
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
NODE_ENV=production

