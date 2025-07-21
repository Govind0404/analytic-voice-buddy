from fastapi import UploadFile
import tempfile
import whisper  # Make sure to install openai-whisper

def transcribe_audio(file: UploadFile) -> str:
    # Save uploaded file to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    # Load Whisper model (can use "base", "small", etc.)
    model = whisper.load_model("base")
    result = model.transcribe(tmp_path)
    return result["text"] 