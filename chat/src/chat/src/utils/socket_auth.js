// filepath: /chat/chat/src/utils/socket_auth.js
import { data } from "react-router-dom";
import socket from "../hooks/useSocket";

export const checkAutthWithSocket = async () => {
    socket.disconnect();
    socket.connect();

    socket.emit('check_auth');
    socket.on("auth_status", () => {
        if (data.isAuthenicated) {
            return { isAuthenicated, user };
        }
    });
};