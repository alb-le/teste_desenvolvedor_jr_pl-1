import os
from langchain_openai import OpenAI
from regex import R


class LLMService:
    def __init__(self):
        # Aqui assumimos que há uma variável de ambiente HF_TOKEN configurada.
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, lang: str) -> str:
        prompt = self.sumarize_text_prefix(lang) + text

        response = self.llm.invoke(prompt)
        return response

    def sumarize_text_prefix(self, lang: str) -> str:
        match lang:
            case "pt":
                return "Resuma o texto a seguir: "	
            case "en":
                return "Summarize the following text: "
            case "es":
                return "Resuma el siguiente texto: "
            case _:
                raise Exception("Language not supported")
