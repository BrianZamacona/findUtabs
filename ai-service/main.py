from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="findUtabs AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://backend:8080", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    transcription_id: int
    audio_path: Optional[str] = None
    source_url: Optional[str] = None


class TrackResult(BaseModel):
    track_type: str
    instrument_detail: Optional[str] = None
    alpha_tex: Optional[str] = None


class AnalysisResult(BaseModel):
    transcription_id: int
    bpm: float
    time_signature: str
    musical_key: Optional[str] = None
    duration_ms: Optional[int] = None
    tracks: list[TrackResult]


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "findutabs-ai"}


@app.post("/analyze", response_model=AnalysisResult)
def analyze(request: AnalysisRequest):
    # TODO: Phase 3 - Demucs source separation to isolate stems
    # TODO: Phase 3 - Basic Pitch for pitch-to-MIDI transcription
    # TODO: Phase 3 - madmom for beat tracking and BPM detection
    # TODO: Phase 3 - Download audio from source_url using yt-dlp

    return AnalysisResult(
        transcription_id=request.transcription_id,
        bpm=120.0,
        time_signature="4/4",
        musical_key="C",
        duration_ms=180000,
        tracks=[
            TrackResult(
                track_type="GUITAR_LEAD",
                instrument_detail="Electric Guitar",
                # TODO: Phase 3 - Replace with real alphaTex generated from Basic Pitch output
                alpha_tex="\\title \"Placeholder\"\n.\\4.4 r.1",
            )
        ],
    )


@app.post("/analyze/upload", response_model=AnalysisResult)
async def analyze_upload(
    transcription_id: int,
    file: UploadFile = File(...),
):
    # TODO: Phase 3 - Handle file type detection (MP3, WAV, MIDI, MusicXML, GuitarPro)
    # TODO: Phase 3 - Save file to temporary storage, run analysis pipeline
    # TODO: Phase 3 - Support Guitar Pro files via alphaTab parser
    # TODO: Phase 3 - Support MIDI files via music21

    return AnalysisResult(
        transcription_id=transcription_id,
        bpm=120.0,
        time_signature="4/4",
        tracks=[
            TrackResult(
                track_type="GUITAR_LEAD",
                instrument_detail="Electric Guitar",
                alpha_tex="\\title \"Placeholder\"\n.\\4.4 r.1",
            )
        ],
    )
