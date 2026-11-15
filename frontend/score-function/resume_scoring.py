import requests
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}


def score_resume(resume_text: str):

    prompt = f"""
You are an ATS resume scoring system.

Return ONLY valid JSON. No explanation.

Format STRICTLY:

{{
  "skills": number,
  "experience": number,
  "projects": number,
  "education": number,
  "impact": number,
  "formatting": number,
  "total_score": number,
  "strengths": [],
  "weaknesses": []
}}

Rules:
- skills (0-25)
- experience (0-25)
- projects (0-20)
- education (0-10)
- impact (0-10)
- formatting (0-10)
- total_score MUST equal sum of all above
- DO NOT add text outside JSON

Resume:
{resume_text}
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return {"error": response.text}

    result = response.json()

    try:
        generated_text = result["choices"][0]["message"]["content"].strip()

        
        start = generated_text.find("{")
        end = generated_text.rfind("}") + 1
        json_str = generated_text[start:end]

        data = json.loads(json_str)

        
        calculated_total = (
            data.get("skills", 0) +
            data.get("experience", 0) +
            data.get("projects", 0) +
            data.get("education", 0) +
            data.get("impact", 0) +
            data.get("formatting", 0)
        )

        data["total_score"] = calculated_total

        return data

    except Exception as e:
        return {
            "error": str(e),
            "raw_output": generated_text
        }