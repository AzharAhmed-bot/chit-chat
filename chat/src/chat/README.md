# Chat Application

This project is a chat application that utilizes socket connections for real-time communication. It includes utilities for handling authentication via sockets.

## Project Structure

```
chat
├── src
│   └── utils
│       ├── auth_socket.js
│       └── socket_auth.js
├── package.json
└── README.md
```

## Utilities

### `src/utils/auth_socket.js`
This file exports the function `checkAutthWithSocket`. It handles socket connections and emits an authentication check event. It listens for the authentication status and returns the authentication state if the user is authenticated.

### `src/utils/socket_auth.js`
This file contains the separated `checkAutthWithSocket` function.

## Installation

To install the necessary dependencies, run:

```
npm install
```

## Usage

To start the application, use the following command:

```
npm start
```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.