import React, { useState } from 'react';
import './Chatbox.css'; // Optional for styling

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const responses = {
    'hello': 'Hi there! How can I assist you?',
    'how are you': 'I am just a bot, but I am doing well!',
    'what is your name': 'I am a simple chatbot created by bonito flakes!',
    'bye': 'Goodbye! Have a great day!',
    'not working' : 'try another browser or reload the page',
    'it is not working' : 'try another browser or reload the page',
    'who do you work for' : 'I work for you sir ! tell me what you need ',
    'cannot find my locatio' : 'try another browser or reload the page',

  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    const botResponse =
      responses[input.toLowerCase()] || "I'm sorry, I don't understand that.";

    setTimeout(() => {
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
