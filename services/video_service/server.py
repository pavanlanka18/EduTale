import os
import uuid
import logging
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edutale.video.server")

app = FastAPI(title="EduTale LTX Video Generation Service")

# Global pipeline instance
pipeline = None


class VideoClipRequest(BaseModel):
    prompt: str = Field(..., description="Visual scene prompt for video generation")
    width: int = Field(default=448, description="Video frame width")
    height: int = Field(default=256, description="Video frame height")
    num_frames: int = Field(default=49, description="Number of frames to generate")
    num_inference_steps: int = Field(default=20, description="Denoising steps")


class VideoClipResponse(BaseModel):
    clip_path: str
    num_frames: int
    duration_seconds: float


@app.on_event("startup")
def load_ltx_pipeline():
    global pipeline
    logger.info("Initializing LTX-Video Pipeline...")
    try:
        from diffusers import LTXPipeline
        from diffusers.utils import export_to_video

        model_id = os.getenv("LTX_MODEL_ID", "Lightricks/LTX-Video")
        pipeline = LTXPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
        )
        if torch.cuda.is_available():
            pipeline.enable_model_cpu_offload()
            pipeline.vae.enable_tiling()
            logger.info("LTX-Video Pipeline loaded on CUDA with CPU Offloading & VAE Tiling.")
        else:
            logger.info("LTX-Video Pipeline loaded on CPU.")
    except Exception as e:
        logger.warning(f"LTX-Video Pipeline failed to load real model weights: {e}. Standalone service active.")


@app.get("/health")
def health_check():
    return {
        "status": "available" if pipeline is not None else "degraded",
        "service": "ltx-video",
        "cuda_available": torch.cuda.is_available()
    }


@app.post("/clip", response_model=VideoClipResponse)
@app.post("/generate", response_model=VideoClipResponse)
def generate_clip(req: VideoClipRequest):
    output_dir = os.path.join("data", "video", "clips")
    os.makedirs(output_dir, exist_ok=True)
    clip_id = f"clip_{uuid.uuid4().hex[:8]}.mp4"
    clip_path = os.path.abspath(os.path.join(output_dir, clip_id))

    if pipeline is not None:
        try:
            from diffusers.utils import export_to_video
            output = pipeline(
                prompt=req.prompt,
                width=req.width,
                height=req.height,
                num_frames=req.num_frames,
                num_inference_steps=req.num_inference_steps,
            )
            frames = output.frames[0]
            export_to_video(frames, clip_path, fps=24)
            logger.info(f"Generated LTX video clip at {clip_path}")
            return VideoClipResponse(
                clip_path=clip_path,
                num_frames=req.num_frames,
                duration_seconds=round(req.num_frames / 24.0, 2)
            )
        except Exception as e:
            logger.error(f"LTX Video generation error: {e}")
            raise HTTPException(status_code=500, detail=f"LTX Video generation failed: {e}")
    else:
        # Generate color video clip using ffmpeg if LTX pipeline is uninitialized
        try:
            import subprocess
            duration_sec = max(2.0, round(req.num_frames / 24.0, 2))
            cmd = [
                "ffmpeg", "-y",
                "-f", "lavfi", "-i", f"color=c=indigo:s={req.width}x{req.height}:d={duration_sec}",
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                clip_path
            ]
            subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
            return VideoClipResponse(
                clip_path=clip_path,
                num_frames=req.num_frames,
                duration_seconds=duration_sec
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Video creation error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
