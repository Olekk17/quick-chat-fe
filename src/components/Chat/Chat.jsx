import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [userId] = useState(Math.random().toString(16).slice(2));
  console.log(userId)
  const socket = io(process.env.BACKEND_URL || "http://localhost:5000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = () => {
    if (currentMessage) {
      socket.emit("message", { userId, message: currentMessage, timestamp: Date.now()});
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => {
        console.log(prevMessages)
        if (prevMessages.some((msg) => msg.timestamp === message.timestamp)) {
          return prevMessages;
        }

        return [...prevMessages, message]
      });
    });
  }, []);

  return (
    <div className="Chat">
      <div className="userId">
        <h3>UserId: {userId}</h3>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div className={message.userId === userId ? "message-row message-right" : "message-row message-left"}>
            <div key={index} className="message">
              <div className="message-sender-id">
                {message.userId}
              </div>
              <div className="message-text">
                {message.message}
              </div>
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button className="send-button" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
