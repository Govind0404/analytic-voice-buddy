import React, { useState } from 'react';

const FileUpload: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {message && <div style={{ color: 'green' }}>{message}</div>}
    </div>
  );
};

export default FileUpload; 