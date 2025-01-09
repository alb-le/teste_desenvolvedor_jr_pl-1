import sys
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str


@app.post("/summarize")
async def summarize(data: TextData):
    text = data.text
    lang = data.lang

    return llm_service.summarize_text(text, lang)

@app.get("/")
async def root():
    return {"API is running"}
