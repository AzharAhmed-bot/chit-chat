import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

const socket = io('http://localhost:5000')

interface messageProps{
    user:string,
    message: string,
}

function Sockets() {
    const [isConnected, setIsConnected] = useState(false)
    const [message, setMessage] = useState<messageProps[]>([])
    const [messageInput, setMessageInput] = useState("")
    const [username, setUserName] = useState("Unknown")

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true)
        })
        socket.on('user_connected', (data) => {
            setUserName(data.user)
        })

        socket.on('received_message', (data) => {
            setMessage((prev) => [...prev, data])
        })

        socket.on('user_disconnected', (data) => {
            console.log(data.user, "Left the chat")
        })
        return () => {
            socket.off('connect')
            socket.off('user_connected')
            socket.off('received_message')
            socket.off('user_disconnected')
        }
    }, [])

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            socket.emit('send_message', { message: messageInput })
            setMessageInput("")
        }
    }
    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>WebSocket Chat</h2>
            <h3>{isConnected ? `Connected as ${username} ` : "Disconnected "}</h3>
            <div
                style={{
                    border: "1px solid black",
                    height: "200px",
                    overflowY: "auto",
                    padding: "10px",
                }}
            >
                {message.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.user}: </strong> {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{ width: "80%", marginTop: "10px" }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Sockets