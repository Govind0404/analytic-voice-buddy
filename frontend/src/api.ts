export async function transcribeAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/transcribe', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return data.transcription;
}

export async function sendChatMessage(message: string): Promise<any> {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return response.json();
} 