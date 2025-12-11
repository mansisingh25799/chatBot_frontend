"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatArea.module.css";
import InputBar from "./InputBar";
import { Message } from "../types/MessageTypes";
import { FaUser, FaRobot, FaCopy, FaCheck } from "react-icons/fa";

export default function ChatArea({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const WS_URL = useRef<string>(process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/chat");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL.current);

    let botBuffer = "";  // collect streamed text
    let streamingMessageId: number | null = null;

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      const data = event.data;

      if (data === "[END]") {
        setIsTyping(false);
        if (streamingMessageId !== null) {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { ...msg, text: botBuffer }
              : msg
          ));
        } else {
          const newMessage: Message = {
            id: Date.now(),
            sender: "bot",
            text: botBuffer,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
        }
        botBuffer = "";
        streamingMessageId = null;
        return;
      }

      if (botBuffer === "") {
        setIsTyping(true);
        streamingMessageId = Date.now();
        const newMessage: Message = {
          id: streamingMessageId,
          sender: "bot",
          text: "",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
      }
      
      botBuffer += data;
      
      // Update the streaming message
      if (streamingMessageId !== null) {
        setMessages(prev => prev.map(msg => 
          msg.id === streamingMessageId 
            ? { ...msg, text: botBuffer }
            : msg
        ));
      }
    };

    ws.current.onclose = () => setConnected(false);

    return () => ws.current?.close();
  }, []);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (connected && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(text);
    }
    setInput("");
  };

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={styles.chatArea}>
      {!connected && (
        <div className={styles.connectionStatus}>
          <div className={styles.connectionDot}></div>
          <span>Connecting...</span>
        </div>
      )}
      {messages.length === 0 && !isTyping && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FaRobot />
          </div>
          <h2 className={styles.emptyStateTitle}>Start a conversation</h2>
          <p className={styles.emptyStateText}>Ask me anything about legal information</p>
        </div>
      )}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === "user" ? styles.userRow : styles.botRow}
          >
            <div className={styles.messageWrapper}>
              <div className={styles.avatar}>
                {msg.sender === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className={styles.messageContent}>
                <div
                  className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
                >
                  {msg.text}
                </div>
                <div className={styles.messageFooter}>
                  <div className={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <button
                    className={styles.copyButton}
                    onClick={() => handleCopy(msg.text, msg.id)}
                    title="Copy message"
                  >
                    {copiedId === msg.id ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={styles.botRow}>
            <div className={styles.messageWrapper}>
              <div className={styles.avatar}>
                <FaRobot />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.botMsg}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <InputBar
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        disabled={!connected}
        placeholder={connected ? "Ask a question..." : "Connecting to bot..."}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
}
