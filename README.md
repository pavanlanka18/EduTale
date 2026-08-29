# EduTale

EduTale is an AI-powered educational learning application that transforms input material (PDF, images, text) into personalized, age-appropriate video story lessons.

## High-Level Architecture

```
INPUT (PDF / Image / Text)
        ↓
CONTENT EXTRACTION & OCR
        ↓
RAG / CONTENT RETRIEVAL
        ↓
PERSONALIZED STORY GENERATION
        ↓
SCENE PLANNING
        ↓
PER-SCENE NARRATION
        ├── Narration → TTS → Audio
        └── Visual Prompt → Text-to-Video → Visual
        ↓
AUDIO + VISUAL SYNCHRONIZATION (FFmpeg)
        ↓
FINAL EDU TALE LESSON
```

## Project Structure Overview

- `frontend/`: User interface for file upload, student profiling, and video playback.
- `backend/`: FastAPI application coordinating APIs, workflows, and task scheduling.
- `models/`: Modular adapters and wrappers for Embedding, LLM, OCR, TTS, and Video models.
- `rag/`: Document loading, chunking, vector storage, and retrieval logic.
- `pipeline/`: Workflow orchestration connecting content extraction through final video compilation.
- `data/`: Temporary input, processed text, audio, scene visuals, and output video artifacts.
- `config/`: Central YAML configuration files for model and application settings.
- `tests/`: Unit and integration test suites.
- `docs/`: Technical documentation and architecture notes.
