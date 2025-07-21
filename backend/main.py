from fastapi import UploadFile, File
from .voice import transcribe_audio
from fastapi import APIRouter
from .schemas import ChatRequest, ChatResponse
from fastapi import Request

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    text = transcribe_audio(file)
    return {"transcription": text}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    # Placeholder: just acknowledge receipt
    return {"message": f"Received file {file.filename} with {len(content)} bytes."}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Placeholder intent classification
    user_message = request.message.lower()
    if "chart" in user_message:
        # Placeholder chart data
        chart_data = {"type": "bar", "data": [1, 2, 3, 4]}
        return ChatResponse(response="Here is your chart!", chart_data=chart_data)
    elif "table" in user_message:
        # Placeholder table data
        table_data = [{"col1": "A", "col2": 1}, {"col1": "B", "col2": 2}]
        return ChatResponse(response="Here is your table!", table_data=table_data)
    else:
        return ChatResponse(response=f"You said: {request.message}") 