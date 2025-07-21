from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    chart_data: Optional[Dict[str, Any]] = None
    table_data: Optional[List[Dict[str, Any]]] = None 