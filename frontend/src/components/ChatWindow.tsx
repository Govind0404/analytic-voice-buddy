import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import ChartView from './ChartView';
import TableView from './TableView';

type Message = {
  user: string;
  bot: {
    response: string;
    chart_data?: any;
    table_data?: any;
  };
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewResponse = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div>
      <h2>Voice Chat</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, minHeight: 200 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <div><strong>You:</strong> {msg.user}</div>
            <div><strong>Bot:</strong> {msg.bot.response}</div>
            {msg.bot.chart_data && (
              <ChartView data={msg.bot.chart_data} />
            )}
            {msg.bot.table_data && (
              <TableView data={msg.bot.table_data} />
            )}
          </div>
        ))}
      </div>
      <AudioRecorder onResponse={handleNewResponse} />
    </div>
  );
};

export default ChatWindow; 