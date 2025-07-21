import React, { useState } from 'react';
import { transcribeAudio, sendChatMessage } from '../api';

const AudioRecorder: React.FC<{ onResponse: (response: any) => void }> = ({ onResponse }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setAudioChunks([]);

    recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

      // 1. Transcribe audio
      const transcription = await transcribeAudio(audioFile);

      // 2. Send transcription to chat
      const chatResponse = await sendChatMessage(transcription);

      // 3. Pass response to parent (e.g., ChatWindow)
      onResponse({ user: transcription, bot: chatResponse });
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default AudioRecorder; 