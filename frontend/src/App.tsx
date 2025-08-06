import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const varFiltersCg = { limit: 5 }; // Required variable as per instructions

const fetchMessages = async () => {
  const { data } = await axios.get('http://localhost:5000/api/messages');
  return data;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [input, setInput] = useState('');
  const [user] = useState(`User${Math.floor(Math.random() * 1000)}`);

  const { data, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  useEffect(() => {
    if (data) setMessages(data);

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev.slice(-4), msg]);
      refetch();
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
    });

    socket.on('stopTyping', () => {
      setTypingUser(null);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [data, refetch]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value) {
      socket.emit('typing', user);
      setTimeout(() => socket.emit('stopTyping'), 2000);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('newMessage', { user, message: input });
      setInput('');
      socket.emit('stopTyping');
    }
  };

  return (
    <div className='flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Real-Time Chat Dashboard</h1>
      <div className='flex-1 overflow-y-auto bg-white p-4 rounded shadow'>
        {messages.map((msg) => (
          <div key={msg.id} className='mb-2'>
            <span className='font-bold'>{msg.user}: </span>
            <span>{msg.message}</span>
            <span className='text-xs text-gray-500 ml-2'>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {typingUser && <div className='text-gray-500 italic'>{typingUser} is typing...</div>}
      </div>
      <div className='mt-4 flex'>
        <input
          type='text'
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className='flex-1 p-2 border rounded-l focus:outline-none'
          placeholder='Type a message...'
        />
        <button
          onClick={sendMessage}
          className='bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600'
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;