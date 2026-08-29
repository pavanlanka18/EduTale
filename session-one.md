# EduTale AI architecture overview

**Session ID:** ses_fb4385bb6ffeRWm3A3PVH2PeWY
**Created:** 8/29/2026, 9:59:30 AM
**Updated:** 8/29/2026, 10:02:12 AM

---

## User

You are working on a hackathon project called "EduTale".

First, understand the project and its intended AI/model architecture. Do NOT write or modify any code yet. Do NOT install packages or download models. At this stage, I only want you to understand the project requirements and architecture.

PROJECT IDEA:
EduTale is an AI-powered educational learning application that converts traditional learning material into personalized, story-based visual lessons.

A learner can provide educational content as:
- Text
- PDF
- Image

The system extracts the educational content and generates a personalized story based on:
- Learner's age
- Grade/class
- Interests
- Educational topic/content

The goal is to make concepts easier and more enjoyable to understand through stories, narration, and visual scenes.

TARGET MODEL PIPELINE:

Input:
PDF / Image / Text
        ↓
Content Extraction
        ↓
RAG / Relevant Content Retrieval
        ↓
Personalized Story Generation
        ↓
Scene Planning
        ↓
Per-scene Narration
        ↓
Text-to-Speech (TTS)
        ↓
Scene Duration
        ↓
Visual Generation
        ↓
Image or Text-to-Video Generation
        ↓
Audio + Visual Synchronization
        ↓
FFmpeg
        ↓
Final EduTale educational video

MODEL COMPONENTS:

1. Embedding Model
Used for the RAG pipeline to convert educational text chunks into embeddings and retrieve relevant information from uploaded learning material.

2. Hugging Face LLM / Text Generation Model
Used to understand the retrieved educational content and generate an age/grade/interest-appropriate educational story.

The story model should ideally produce structured output containing:
- Story title
- Learning objectives
- Story
- Scene information
- Per-scene narration
- Visual prompts

3. TTS Model
Converts each scene's narration text into spoken audio.

The audio is NOT used to generate the video.
The audio provides narration and determines the approximate duration of each scene.

4. Text-to-Video Model
Receives the visual prompt for each scene and generates a short visual video clip.

The system should generate multiple short scenes rather than attempting to generate one long 60-second video.

5. OCR Model
Potentially used when the user provides an image containing educational material. It converts the image into text before the content-understanding stage.

TARGET VIDEO FLOW:

Story
 ↓
Scene 1
  ├── narration → TTS → audio
  └── visual prompt → video/image model → visual

Scene 2
  ├── narration → TTS → audio
  └── visual prompt → video/image model → visual

Scene 3
  ├── narration → TTS → audio
  └── visual prompt → video/image model → visual

...

The scene audio duration should be used to synchronize the corresponding visual.

Finally, FFmpeg combines the scenes, narration, and optionally subtitles/background music into one final educational video.

IMPORTANT:
The final video does NOT need to be exactly 60 seconds. It can naturally be around 55, 60, 65, or 70 seconds depending on the generated story and narration.

MODEL SELECTION PRIORITIES:

This is a 48-hour hackathon, so prioritize:
- Fast inference
- Ability to run locally where practical
- Reasonable RAM/VRAM requirements
- Good output quality
- Easy integration
- Open-source/Hugging Face availability
- Ability to use pretrained models
- Fine-tuning feasibility for the story-generation model

The video-generation model is expected to be the most computationally expensive component.

There is also a possible architecture where the video-generation model runs on a separate, more powerful machine and the EduTale backend communicates with it through an API. Keep this possibility in mind, but do not implement it yet.

FINE-TUNING DIRECTION:

We may fine-tune the story-generation LLM using a lightweight method such as LoRA/PEFT.

Fine-tuning is intended to teach the model how to generate educational stories in the desired structure/style.

RAG and fine-tuning have different purposes:
- RAG provides relevant educational knowledge from the user's documents.
- Fine-tuning teaches the model how to transform that knowledge into suitable educational stories.

Do not assume fine-tuning is mandatory for the MVP until we evaluate the available models and hardware.

CURRENT SCOPE:

At this stage, ONLY understand and reason about the MODEL IMPLEMENTATION.

Do not:
- Write application code
- Create backend endpoints
- Create frontend
- Install dependencies
- Download models
- Start implementation
- Make assumptions about specific models

After understanding this architecture, respond with:
1. Your understanding of EduTale's model pipeline
2. The role of each model
3. The data flowing between each model
4. Which model components are mandatory vs optional
5. Any technical risks you see, especially regarding local video generation

Do not propose implementation code yet.

---

## Assistant (Build · gemini/gemini-3.7-flash · 5.0s)

_Thinking:_

**Analyzing EduTale Requirements**

I've begun dissecting the EduTale project's core requirements. I'm focusing on the AI and model architecture section, looking for the specific goals and constraints. I am now double-checking the instructions, to avoid coding before I've fully understood the parameters.




**Tool: glob**

---

## Assistant (Build · gemini/gemini-3.7-flash · 20.9s)

_Thinking:_

**Analyzing Project Scope**

Okay, I'm deep diving into the project brief to fully grasp its goals and the envisioned AI architecture. Right now, my focus is solely on understanding the scope of the project and the intended model design – no coding or package installation yet. I want to build a solid foundation before I start building.


**Defining the Pipeline**

Okay, I'm now structuring my analysis around EduTale's model pipeline as requested. I've begun to break down each stage, from input ingestion and OCR (if needed), all the way through to structured JSON output generation. Currently, I'm focused on the flow sequence and the function of each step in the educational video creation process.


**Mapping the Processing Sequence**

I'm now focusing on the processing flow for each scene within the educational video. It will involve simultaneous or serial processing. I am considering TTS for audio and image generation for visual elements. After, I am thinking of time-matching them before merging the audio and video into a final MP4, by using FFmpeg.


**Detailing the Architectural Components**

I'm now diving into the specifics of each model within the pipeline. I'm focusing on the integration of TTS for narration and visual generation, considering potential LoRA/PEFT fine-tuning. I'm also examining the data flow between each component, from raw text ingestion through embedding, vector storage, and search. I need to nail down the specifics of scene breakdown, narration scripts, and image/video prompts to ensure seamless synchronization and coherent visual storytelling.


**Clarifying Core Components**

I'm now zeroing in on mandatory versus optional model components. The Hugging Face LLM, TTS model, and visual generation are non-negotiable, central to the project's success. I need to make these work as the base, then extend from there. I'm moving toward the LLM's central function of breaking text into scenes and generating prompts. I have also added in the required outputs.


**Prioritizing Model Requirements**

Okay, I'm now prioritizing model requirements, separating mandatory components from optional features. FFmpeg is crucial for video/audio merging. OCR, embedding/RAG, and LoRA fine-tuning are conditional, depending on input format and LLM performance. I'm focusing on a robust MVP, leveraging prompt engineering for structural outputs before considering fine-tuning. A Text-to-Video model is optional, with image generation as a viable substitute.


**Assessing Technical Hurdles**

I am now focusing on the technical obstacles, especially those related to local video generation and time constraints. I'm concerned about the intensive resource needs of text-to-video models; they may be slow. Also, the frame rate mismatch between TTS and T2V models seems like a big challenge, with varying audio length compared to fixed-length video frames. It's becoming obvious that generating scenes locally will be unfeasible. I will focus on LLM reliability next.




Here is a structured overview and technical analysis of the **EduTale** model architecture and pipeline for your hackathon project.

---

### 1. Understanding of EduTale’s Model Pipeline

EduTale is an end-to-end multi-modal learning pipeline that converts unstructured educational input (Text, PDF, Image) into a personalized visual and audio story. 

The pipeline works in stages:
1. **Ingest & Extraction:** Reads input material (applying OCR if images are provided).
2. **Context Retrieval (RAG):** Extracts and ranks the most relevant factual information from the uploaded material based on the educational topic.
3. **Structured Story Synthesis:** An LLM consumes the retrieved facts along with user metadata (age, grade, interests) and outputs a structured lesson (title, objectives, scene script, and visual prompts).
4. **Parallel/Sequential Scene Generation:**
   - **Audio Stream:** A TTS model generates per-scene voiceover narration and measures the exact audio duration.
   - **Visual Stream:** A Text-to-Video (or visual) model generates corresponding visual assets based on the scene's visual prompt.
5. **Dynamic Audio-Visual Alignment:** Uses the measured TTS audio duration as the ground-truth clock to stretch, loop, or pad the visual clip for that scene.
6. **Compositing (FFmpeg):** Merges audio and video streams across all scenes into a single synchronized MP4 video.

---

### 2. Role of Each Model Component

| Model Component | Role in EduTale |
| :--- | :--- |
| **OCR Model** | Converts text embedded inside uploaded images or scanned documents into clean plain text for downstream extraction. |
| **Embedding Model** | Generates vector representations of document chunks to index educational material and allow semantic search for relevant context. |
| **Hugging Face LLM** | Acts as the central reasoning engine. Combines user profile (age/grade/interests) with retrieved facts to generate a structured lesson breakdown (narration + visual prompts). |
| **TTS Model** | Converts per-scene narration text into natural-sounding speech audio and establishes the exact duration baseline for each scene. |
| **Text-to-Video / Visual Model** | Transforms the visual prompts into video clips or visual keyframes representing the concepts being narrated. |

---

### 3. Data Flow Between Models

```
[User Input: PDF/Image/Text]
         │
         ▼
    (OCR Model) ───[Extracted Raw Text]───► Chunking & Tokenization
                                                   │
                                                   ▼
[User Query + Profile] ───► (Embedding Model) ───► [Vector Index Search]
                                                   │
                                                   ▼
                                         [Retrieved Fact Chunks]
                                                   │
                                                   ▼
                                           (Hugging Face LLM)
                                                   │
                                                   ▼
                                     [Structured JSON Output]
                                     ├─ Title & Objectives
                                     └─ Scene Array:
                                        ├─ Scene ID
                                        ├─ Narration Text
                                        └─ Visual Prompt
                                                   │
               ┌───────────────────────────────────┴───────────────────────────────────┐
               ▼                                                                       ▼
    (Per-Scene TTS Model)                                                (Per-Scene Visual Model)
               │                                                                       │
               ▼                                                                       ▼
     [Scene Audio (.wav)]                                                     [Scene Video (.mp4)]
   + [Measured Duration (sec)]                                                         │
               │                                                                       │
               └───────────────────────────────────┬───────────────────────────────────┘
                                                   │
                                                   ▼
                                       [Audio-Visual Sync Module]
                                                   │
                                                   ▼
                                           (FFmpeg Engine)
                                                   │
                                                   ▼
                                    [Final EduTale Video (.mp4)]
```

---

### 4. Mandatory vs. Optional Model Components

#### Mandatory
* **Hugging Face LLM:** Essential for educational scriptwriting, scene decomposition, and visual prompt engineering.
* **TTS Model:** Essential for providing voiceover narration and defining the target scene durations.
* **Visual Generation Model (Video or Image):** Essential for generating visual scenes for each story segment.
* **FFmpeg (Tooling):** Essential for stitching multi-modal assets into the final video file.

#### Optional / Conditional
* **OCR Model:** Optional. Only needed when the user uploads an image or scanned PDF containing text.
* **Embedding Model / RAG:** Conditional. Necessary for large documents/PDFs to prevent context overload; can be bypassed for short direct text inputs.
* **LLM Fine-Tuning (LoRA/PEFT):** Optional for MVP. Base LLMs with good system prompt engineering or JSON schema constraints can handle MVP output generation; fine-tuning is an enhancement step for style/format consistency.
* **Native Text-to-Video Model:** Optional fallback to **Text-to-Image (SD) + Camera Motion** if local video model computation proves too slow during testing.

---

### 5. Technical Risks & Hackathon Considerations

1. **VRAM Constraints & GPU Memory Contention:**
   - Running an LLM, embedding model, TTS model, and Text-to-Video model simultaneously on a single machine will quickly lead to CUDA Out-Of-Memory (OOM) errors.
   - **Risk Mitigation:** Models must be invoked sequentially (unloading/loading VRAM as needed) or offloaded to API endpoints (especially video generation).

2. **Inference Latency in Local Video Generation:**
   - Text-to-Video models (e.g., AnimateDiff, CogVideoX, LTX-Video) are slow on consumer GPUs. Generating 5–6 video clips locally could take 10–20+ minutes per video request, which is prohibitive for live hackathon demos.
   - **Fallback Architecture:** Consider using an Image Generation model (e.g., Stable Diffusion) with automated zoom/pan camera movements or remote GPU API hosting for video generation.

3. **Audio-Visual Duration Mismatches:**
   - TTS duration varies dynamically based on text length and speech rate (e.g., 7.4 seconds), whereas Text-to-Video models typically produce clips with fixed frame counts/durations (e.g., 2–4 seconds).
   - **Risk Mitigation:** Video clips will need to be slowed down, looped, or held on a still frame using FFmpeg filters to match the exact TTS audio duration without causing visual stutters.

4. **Structured JSON Output Flakiness:**
   - If the LLM produces malformed JSON or omits fields (e.g., missing visual prompt for Scene 3), the downstream execution pipeline will crash.
   - **Risk Mitigation:** Use strict JSON mode / constrained sampling libraries (like `outlines` or `guidance`) or robust fallback parsing logic.

---

## User

give me 10 lines about what you understand

---

## Assistant (Build · gemini/gemini-3.7-flash · 5.6s)

_Thinking:_

**Summarizing Understandings**

I'm now focusing on distilling my comprehension into precisely 10 lines. The key is conciseness; each line needs to encapsulate a facet of my understanding of EduTale, guided by the instructions. Accuracy in the line count is paramount.




1. EduTale converts educational inputs (Text, PDF, Image) into personalized, visual story-based learning videos.
2. An OCR model optionally extracts raw text from uploaded images before content processing begins.
3. An embedding model indexes and retrieves relevant factual content from user documents using a RAG pipeline.
4. A Hugging Face LLM combines retrieved facts with learner metadata (age, grade, interests) to write structured scene scripts.
5. The LLM outputs a structured breakdown including title, learning objectives, per-scene narration, and visual prompts.
6. A TTS model converts scene narration into audio and establishes the ground-truth duration for each scene.
7. A visual/video model generates short visual clips corresponding to each scene's specific prompt.
8. Multiple short scenes are generated independently rather than attempting to generate one long monolithic video.
9. Visual clip durations are stretched, looped, or padded in FFmpeg to match the exact TTS audio timing per scene.
10. FFmpeg composite engine stitches all audio, visual, and optional subtitle layers into the final EduTale video.

---

