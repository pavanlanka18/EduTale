import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.llm.story_model import story_llm
from models.tts.tts_model import tts_adapter
from pipeline.story_pipeline import story_pipeline
from pipeline.scene_pipeline import scene_pipeline
from pipeline.media_pipeline import media_pipeline
from pipeline.lesson_pipeline import lesson_pipeline

SAMPLE_PROFILE = {
    "name": "Alex",
    "age": 10,
    "grade": "Grade 5",
    "interests": ["animals", "space"]
}

def test_story_llm_generation():
    """Test generating structured story output."""
    story = story_llm.generate_story(
        rag_context="Photosynthesis converts solar light into plant energy.",
        student_profile=SAMPLE_PROFILE,
        topic="Photosynthesis"
    )
    assert "title" in story
    assert "scenes" in story
    assert len(story["scenes"]) == 3
    assert "quiz" in story

def test_scene_decomposition():
    """Test decomposing story into scenes with calculated durations."""
    story = story_llm.generate_story(
        rag_context="Producers make energy.",
        student_profile=SAMPLE_PROFILE,
        topic="Food Chain"
    )
    scenes = scene_pipeline.decompose_into_scenes(story)
    assert len(scenes) == 3
    assert scenes[0]["duration"] >= 5

def test_tts_audio_generation():
    """Test generating WAV audio file and measuring exact duration."""
    narration_text = "Milo the zebra eats lush green grass to gain solar energy."
    audio_info = tts_adapter.generate_narration_audio(narration_text, scene_id="test_scene_1")
    
    assert os.path.exists(audio_info["audio_path"])
    assert audio_info["measured_duration"] > 0.0

def test_end_to_end_lesson_pipeline():
    """Test executing full end-to-end lesson workflow."""
    result = lesson_pipeline.execute_full_lesson_pipeline(
        lesson_id="test_les_100",
        title="Jungle Ecosystem",
        content="Plants use sun light to grow. Zebras eat grass.",
        student_profile=SAMPLE_PROFILE,
        content_type="text"
    )

    assert result["lesson_id"] == "test_les_100"
    assert "story" in result
    assert "video_url" in result
    assert result["total_scenes"] == 3
