import logging
from typing import Dict, Any, List

logger = logging.getLogger("edutale.pipeline.scene")

class ScenePipeline:
    """Pipeline for decomposing stories into synchronized scene objects."""

    def decompose_into_scenes(self, story_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Decompose story output into processed scene items."""
        raw_scenes = story_data.get("scenes", [])
        processed_scenes = []

        for idx, scene in enumerate(raw_scenes, start=1):
            narration = scene.get("narration", "")
            # Estimate narration duration based on average speaking rate (approx. 2.5 words/sec)
            word_count = len(narration.split())
            estimated_duration = max(8, round(word_count / 2.2))

            processed_scene = {
                "id": idx,
                "title": scene.get("title", f"Scene {idx}"),
                "narration": narration,
                "visualDescription": scene.get("visualDescription", f"Visual prompt for scene {idx}"),
                "duration": estimated_duration,
                "conceptsHighlighted": scene.get("conceptsHighlighted", [])
            }
            processed_scenes.append(processed_scene)

        logger.info(f"Decomposed story '{story_data.get('title')}' into {len(processed_scenes)} scenes.")
        return processed_scenes

scene_pipeline = ScenePipeline()
