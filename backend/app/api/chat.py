from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import google.generativeai as genai

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
)

class ChatMessage(BaseModel):
    role: str # "user" or "model" (frontend sends "user" or "bot")
    parts: List[str]

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str

SYSTEM_INSTRUCTION = """
You are MindMate, a supportive and empathetic mental wellness companion.
Your goal is to help users feel calmer and more focused.
Be conversational, encouraging, and kind. Keep your responses relatively short (1-3 sentences) unless they ask for detailed advice.
If they seem highly distressed, gently remind them that you are an AI and they should seek professional help.
Do not use markdown headers unless necessary, keep it conversational.

IMPORTANT: If the user asks you to open a specific page (e.g., "Log Mood", "Start Reflection", "Assessment", "Journal", "Resources", "History", "Profile", "Mood Tracker"), you MUST use the open_page tool to navigate them there. 
Map their requests to these pages:
- "Log Mood" or "Assessment" -> 'assessment'
- "Start Reflection" or "Journal" -> 'journal'
- "History" -> 'history'
- "Mood Tracker" or "Meditation" -> 'mood-booster'
- "Resources" or "Community" -> 'resources'
- "Profile" -> 'profile'
"""

import json
from groq import Groq

@router.post("")
async def chat_with_groq(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"response": "Hi! I'm MindMate. My Groq brain isn't connected yet. Please add GROQ_API_KEY to the backend .env!", "action": None}

    action = None
    
    # We define the tool definition for the Groq API
    tools = [
        {
            "type": "function",
            "function": {
                "name": "open_page",
                "description": "Opens a specific page in the application. Call this when the user asks to open the mood tracker (mood-booster), journal/history (history), assessment (assessment), resources (resources), or profile (profile).",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "page_name": {
                            "type": "string",
                            "enum": ["dashboard", "assessment", "journal", "mood-booster", "resources", "profile", "history"]
                        }
                    },
                    "required": ["page_name"]
                }
            }
        }
    ]

    try:
        client = Groq(api_key=api_key)
        
        # Format history for Groq/OpenAI format
        formatted_history = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
        
        for msg in request.history:
            # Map frontend 'bot' to 'assistant', 'user' stays 'user'
            role = "assistant" if msg.role == "bot" else "user"
            content = " ".join(msg.parts)
            formatted_history.append({"role": role, "content": content})
            
        # Append the new message
        formatted_history.append({"role": "user", "content": request.message})
        
        # Call Groq API
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=formatted_history,
            tools=tools,
            tool_choice="auto",
            max_tokens=250
        )
        
        response_message = response.choices[0].message
        
        # Handle tool calls if the model decided to use one
        if response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                if tool_call.function.name == "open_page":
                    args = json.loads(tool_call.function.arguments)
                    page_name = args.get("page_name")
                    if page_name:
                        action = {"type": "navigate", "target": f"/{page_name}"}
        
        # Generate final text response if tools were called, or use the generated response
        if action and not response_message.content:
            text_response = f"Sure! Opening {page_name} for you."
        else:
            text_response = response_message.content or "Okay!"
            
        return {"response": text_response, "action": action}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        print(f"Chat error: {error_msg}", flush=True)
        if "rate limit" in error_msg.lower() or "429" in error_msg:
            return {"response": "I'm thinking too fast! Please wait a minute and try again. 🌿", "action": None}
        raise HTTPException(status_code=500, detail="Failed to generate response")
