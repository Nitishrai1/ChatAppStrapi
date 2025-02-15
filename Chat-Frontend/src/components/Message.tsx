"use client";

import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import styles from "./page.module.css";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: string;
  message: string;
}

export default function Messages() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sender] = useState("nitish");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    const newSocket = new WebSocket(`ws://localhost:8080?token=${token}`);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      if (data.type === "history") {
        setMessages(data.data); // Load past messages on login
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSending = () => {
    if (inputMessage.trim() && socket) {
      const newMessage = { sender: sender, message: inputMessage.trim() };
      socket.send(JSON.stringify(newMessage));
      setInputMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Remove token
    navigate("/"); // Redirect to login
  };

  if (!socket) {
    return <div className={styles.loading}>Connecting to chat server...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h3 className={styles.title}>Start Chatting</h3>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Chat Messages */}
      <div className={styles.messageArea}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            sender={msg.sender}
            message={msg.message}
            isSelf={msg.sender === sender}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className={styles.inputArea}>
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSending()}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button onClick={handleSending} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
