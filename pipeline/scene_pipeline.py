import logging
from typing import List, Dict, Any

logger = logging.getLogger("edutale.pipeline.scene")


def prose_to_scenes(story_text: str, target_scenes: int = 4) -> dict:
    """Split prose into scene dicts matching ScenePipeline's expected shape."""
    paras = [p.strip() for p in story_text.split("\n\n") if p.strip()]
    if len(paras) < target_scenes:
        import re
        sents = re.split(r'(?<=[.!?])\s+', story_text)
        sents = [s for s in sents if s.strip()]
        per = max(1, len(sents) // target_scenes)
        paras = [" ".join(sents[i:i+per]) for i in range(0, len(sents), per)]

    paras = paras[:target_scenes]
    return {
        "title": story_text.split("\n")[0][:60] if story_text else "Educational Story",
        "scenes": [
            {
                "title": f"Scene {i}",
                "narration": p,
                "visualDescription": p,
                "conceptsHighlighted": [],
            }
            for i, p in enumerate(paras, start=1)
        ],
    }


class ScenePipeline:
    def decompose_into_scenes(self, story_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        raw_scenes = story_data.get("scenes", [])
        decomposed = []

        for idx, scene in enumerate(raw_scenes, start=1):
            narration = scene.get("narration", "")
            word_count = len(narration.split())
            estimated_duration = max(4, round(word_count / 2.0))

            decomposed.append({
                "id": scene.get("id", idx),
                "title": scene.get("title", f"Scene {idx}"),
                "narration": narration,
                "visualDescription": scene.get("visualDescription", narration),
                "duration": estimated_duration,
                "conceptsHighlighted": scene.get("conceptsHighlighted", [])
            })

        logger.info(f"Decomposed story '{story_data.get('title')}' into {len(decomposed)} scenes.")
        return decomposed


scene_pipeline = ScenePipeline()
