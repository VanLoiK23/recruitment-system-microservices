import os
os.environ["USE_TF"] = "0"

import re
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim

MODEL_NAME = "./cv-jd-sbert-techroute" 
SKILL_VOCAB: list[str] = [] 

ml_state: dict = {}


def load_skill_vocab() -> list[str]:
    # select from skill_vocab.txt
    try:
        with open("skill_vocab.txt", encoding="utf-8") as f:
            return [line.strip() for line in f if len(line.strip()) > 1]
    except FileNotFoundError:
        return []


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading model...")
    ml_state["model"] = SentenceTransformer(MODEL_NAME)
    ml_state["skill_vocab"] = load_skill_vocab()
    print(f"Model loaded. Skill vocab size: {len(ml_state['skill_vocab'])}")
    yield
    ml_state.clear()


app = FastAPI(title="CV-JD Matching Service", lifespan=lifespan)


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]


class ScoreRequest(BaseModel):
    cv_text: str
    job_text: str
    job_level: Optional[str] = None
    w_sbert: float = 0.6
    w_skill: float = 0.4


class ScoreResponse(BaseModel):
    final_score: float
    sbert_score: float
    skill_score: float
    verdict: str
    seniority_mismatch_warning: bool


def extract_skills(text: str, vocab: list[str]) -> set[str]:
    text_lower = text.lower()
    found = set()
    for s in vocab:
        pattern = r"\b" + re.escape(s.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.add(s.lower())
    return found


def skill_jaccard(cv_text: str, job_text: str, vocab: list[str]) -> float:
    cv_skills = extract_skills(cv_text, vocab)
    job_skills = extract_skills(job_text, vocab)
    if not cv_skills and not job_skills:
        return 0.0
    return len(cv_skills & job_skills) / len(cv_skills | job_skills)


def detect_seniority_flag(cv_text: str, job_level: Optional[str]) -> bool:
    junior_signals = ["intern", "entry-level", "entry level", "junior", "trainee", "fresher"]
    cv_is_junior = any(s in cv_text.lower() for s in junior_signals)
    job_is_senior = (job_level or "").lower() in ["senior", "lead", "principal"]
    return cv_is_junior and job_is_senior


def compute_verdict(final_score: float) -> str:
    if final_score < 0.3:
        return "out_of_scope"
    elif final_score < 0.55:
        return "low_match"
    elif final_score < 0.75:
        return "partial_match"
    return "strong_match"


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": "model" in ml_state}


@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest):
    if "model" not in ml_state:
        raise HTTPException(status_code=503, detail="Model not loaded")
    vec = ml_state["model"].encode(req.text).tolist()
    return EmbedResponse(embedding=vec)


@app.post("/score", response_model=ScoreResponse)
def score(req: ScoreRequest):
    """Cham 1 cap CV-JD le -- dung khi ung vien vua nop CV, chua co embedding cache."""
    if "model" not in ml_state:
        raise HTTPException(status_code=503, detail="Model not loaded")

    model = ml_state["model"]
    vocab = ml_state["skill_vocab"]

    cv_emb = model.encode(req.cv_text)
    job_emb = model.encode(req.job_text)
    sbert_score = cos_sim(cv_emb, job_emb).item()
    sk_score = skill_jaccard(req.cv_text, req.job_text, vocab)
    final = req.w_sbert * sbert_score + req.w_skill * sk_score

    return ScoreResponse(
        final_score=round(final, 3),
        sbert_score=round(sbert_score, 3),
        skill_score=round(sk_score, 3),
        verdict=compute_verdict(final),
        seniority_mismatch_warning=detect_seniority_flag(req.cv_text, req.job_level),
    )


class ScoreBatchRequest(BaseModel):
    job_text: str
    job_level: Optional[str] = None
    candidates: list[dict]  # [{"id": "cv_123", "cv_text": "...", "cv_embedding": [...] (optional)}]
    w_sbert: float = 0.6
    w_skill: float = 0.4


class ScoreBatchResult(BaseModel):
    id: str
    final_score: float
    sbert_score: float
    skill_score: float
    verdict: str
    seniority_mismatch_warning: bool


@app.post("/score/batch", response_model=list[ScoreBatchResult])
def score_batch(req: ScoreBatchRequest):
    """Cham diem 1 JD voi nhieu CV cung luc -- dung cho man 'xep hang ung vien cho job nay'.
    Neu candidate da co san 'cv_embedding' (da cache truoc do), dung lai, khong encode lai."""
    if "model" not in ml_state:
        raise HTTPException(status_code=503, detail="Model not loaded")

    model = ml_state["model"]
    vocab = ml_state["skill_vocab"]
    job_emb = model.encode(req.job_text)

    results = []
    for c in req.candidates:
        if "cv_embedding" in c and c["cv_embedding"]:
            cv_emb = c["cv_embedding"]
        else:
            cv_emb = model.encode(c["cv_text"]).tolist()

        sbert_score = cos_sim(cv_emb, job_emb).item()
        sk_score = skill_jaccard(c.get("cv_text", ""), req.job_text, vocab)
        final = req.w_sbert * sbert_score + req.w_skill * sk_score

        results.append(ScoreBatchResult(
            id=c["id"],
            final_score=round(final, 3),
            sbert_score=round(sbert_score, 3),
            skill_score=round(sk_score, 3),
            verdict=compute_verdict(final),
            seniority_mismatch_warning=detect_seniority_flag(c.get("cv_text", ""), req.job_level),
        ))

    results.sort(key=lambda r: r.final_score, reverse=True)
    return results
