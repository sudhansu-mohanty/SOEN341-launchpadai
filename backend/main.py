import io
import re
import os
import json
import time
import requests

import pdfplumber
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


def extract_text(pdf_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
    return "\n".join(pages).strip()


def extract_email(text: str) -> str | None:
    match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    match = re.search(
        r"(\+?\d[\d\s\-().]{7,}\d)", text
    )
    return match.group(0).strip() if match else None


def analyze_resume(resume_text: str) -> dict:
    """Single Groq call: scoring + structure extraction combined."""
    prompt = f"""You are an ATS resume analysis system. Return ONLY valid JSON. No explanation. No markdown. No code blocks.

Fill this JSON exactly:
{{
  "name": "full name or empty string",
  "parsed_skills": ["skill1", "skill2"],
  "experience_entries": [
    {{"title": "Job Title", "company": "Company", "duration": "Start-End", "responsibilities": ["bullet 1"]}}
  ],
  "education_entries": [
    {{"degree": "Degree", "institution": "School", "year": "Year"}}
  ],
  "certification": ["cert1"],
  "skills": 0,
  "experience": 0,
  "projects": 0,
  "education": 0,
  "impact": 0,
  "formatting": 0,
  "total_score": 0,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"]
}}

Scoring rules: skills(0-25), experience(0-25), projects(0-20), education(0-10), impact(0-10), formatting(0-10). total_score = sum.

Resume:
{resume_text[:2500]}
"""

    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": 1500,
    }

    for attempt in range(3):
        try:
            res = requests.post(GROQ_API_URL, headers=GROQ_HEADERS, json=payload)
            if res.status_code == 429:
                time.sleep(8)
                continue
            if res.status_code != 200:
                return {"error": res.text}
            text = res.json()["choices"][0]["message"]["content"].strip()
            start = text.find("{")
            end = text.rfind("}") + 1
            return json.loads(text[start:end])
        except Exception as e:
            return {"error": str(e)}
    return {"error": "Rate limit exceeded after retries."}


@app.post("/resume/extract")
async def extract_and_score(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    pdf_bytes = await file.read()

    try:
        raw_text = extract_text(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read PDF: {e}")

    if not raw_text:
        raise HTTPException(status_code=422, detail="PDF appears to be empty or image-only.")

    result = analyze_resume(raw_text)

    if "error" in result:
        raise HTTPException(status_code=502, detail=f"Analysis failed: {result['error']}")

    # Recalculate total to be safe
    total = (
        result.get("skills", 0) + result.get("experience", 0) +
        result.get("projects", 0) + result.get("education", 0) +
        result.get("impact", 0) + result.get("formatting", 0)
    )

    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    skills = result.get("parsed_skills", [])

    highlights = ["Resume content successfully parsed"]
    if email:
        highlights.append(f"Email detected: {email}")
    if phone:
        highlights.append(f"Phone detected: {phone}")

    return {
        "filename": file.filename or "resume.pdf",
        "score": total,
        "skills_score": result.get("skills", 0),
        "experience_score": result.get("experience", 0),
        "projects_score": result.get("projects", 0),
        "education_score": result.get("education", 0),
        "impact_score": result.get("impact", 0),
        "formatting_score": result.get("formatting", 0),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "summary": "Resume extracted and analyzed successfully.",
        "highlights": highlights,
        "analysis": {
            "email": email,
            "phone": phone,
            "skills": skills,
            "experience_preview": "",
            "education_preview": "",
        },
        "structured_resume": {
            "name": result.get("name", ""),
            "email": email or "",
            "phone": phone or "",
            "skills": skills,
            "education": result.get("education_entries", []),
            "experience": result.get("experience_entries", []),
            "certification": result.get("certification", []),
        },
        "raw_text": raw_text,
    }
