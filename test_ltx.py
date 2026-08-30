import time, torch
from diffusers import DiffusionPipeline
from diffusers.utils import export_to_video, load_image

MODEL = "Lightricks/LTX-Video"   # 2B — the only size that fits 6GB

print(f"VRAM: {torch.cuda.get_device_properties(0).total_memory/1e9:.2f} GB")
print("\nLoading (first run downloads ~10GB)...")

t0 = time.time()
pipe = DiffusionPipeline.from_pretrained(MODEL, dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()    # essential at 6GB
pipe.vae.enable_tiling()
# do NOT call pipe.to("cuda") — conflicts with cpu_offload
print(f"Loaded in {time.time()-t0:.1f}s")

image = load_image(
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/penguin.png"
)

prompt = (
    "A cute cartoon penguin stands in soft snow, gently flapping its flippers. "
    "Light snowflakes drift down. Warm afternoon light, soft shadows, "
    "children's storybook illustration style, gentle slow motion."
)

print("\nGenerating 448x256, 49 frames...")
t0 = time.time()
try:
    frames = pipe(
        prompt=prompt,
        negative_prompt="worst quality, blurry, jittery, distorted",
        width=448,
        height=256,
        num_frames=49,
        num_inference_steps=20,
        generator=torch.Generator().manual_seed(0),
    ).frames[0]

    export_to_video(frames, "test_output.mp4", fps=24)
    dt = time.time() - t0
    print(f"\nSUCCESS — {dt:.1f}s -> test_output.mp4")
    print(f"Peak VRAM: {torch.cuda.max_memory_allocated()/1e9:.2f} GB")
    print(f"3-scene story would cost ~{dt*3/60:.1f} min")

except torch.cuda.OutOfMemoryError as e:
    print(f"\nOOM: {e}")
    print("Retry with width=320, height=192, num_frames=25")