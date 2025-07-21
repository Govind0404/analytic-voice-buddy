import React from 'react';
import ChatWindow from './components/ChatWindow';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Sales Chat Voice Assistant</h1>
      <FileUpload />
      <ChatWindow />
    </div>
  );
};

export default App;
