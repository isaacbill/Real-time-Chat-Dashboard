import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const socket = io("http://localhost:5000");

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

export default function ChatDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axios.get<Message[]>("http://localhost:5000/api/messages");
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (user: string) => {
      setTyping(user);
    });

    socket.on("stop_typing", () => {
      setTyping(null);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  useEffect(() => {
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    const newMessage: Message = {
      id: Date.now(),
      user: "You",
      message: input,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    socket.emit("stop_typing");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("typing", "You");
    if (e.target.value === "") {
      socket.emit("stop_typing");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <div
        ref={messageListRef}
        className="h-80 overflow-y-auto border p-2 rounded mb-2 bg-gray-100"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.user}:</strong> {msg.message}
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {typing && <div className="italic text-gray-500 mb-2">{typing} is typing...</div>}

      <input
        type="text"
        value={input}
        onChange={handleTyping}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="w-full border rounded p-2"
        placeholder="Type a message..."
      />
    </div>
  );
}
