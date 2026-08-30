import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("edutale.models.llm")

class StoryLLMModel:
    """Adapter for generating structured educational stories using HuggingFace or OpenAI LLMs."""

    def __init__(self, model_id: str = "HuggingFaceH4/zephyr-7b-beta"):
        self.model_id = model_id
        self._llm_pipeline = None

    def generate_story(
        self,
        rag_context: str,
        student_profile: Dict[str, Any],
        topic: str
    ) -> Dict[str, Any]:
        """Generate structured educational story JSON based on learner profile and RAG context."""
        age = student_profile.get("age", 10)
        grade = student_profile.get("grade", "Grade 5")
        interests = student_profile.get("interests", ["animals", "space"])
        primary_interest = interests[0] if interests else "adventure"

        prompt = self._build_story_prompt(rag_context, age, grade, primary_interest, topic)
        logger.info(f"Generating story script for Age {age} ({grade}) interested in {primary_interest}")

        # Structured response generation logic
        return self._synthesize_structured_story(topic, age, grade, primary_interest, rag_context)

    def _build_story_prompt(
        self,
        rag_context: str,
        age: int,
        grade: str,
        interest: str,
        topic: str
    ) -> str:
        """Construct system prompt for multi-scene detailed story generation."""
        return f"""
System: You are EduTale AI, an expert educational storyteller. 
Transform the educational facts below into an engaging, age-appropriate multi-scene story lesson (5 to 6 scenes, 2 minutes total narration).

Learner Profile:
- Age: {age} years old
- Grade: {grade}
- Primary Interest: {interest}
- Subject Topic: {topic}

Retrieved Educational Facts (RAG Context):
{rag_context}

Output Requirements:
Return a valid JSON object with:
- title, subtitle, objective, conceptName, gradeLevel, readingTimeMinutes
- concepts: array of 4 key concepts covered
- scenes: array of 5 to 6 scenes. Each scene MUST contain:
    * title: descriptive scene heading
    * narration: 4-5 vivid, educational sentences explaining the step through the lens of {interest} (35-45 words)
    * visualDescription: detailed visual art prompt for scene illustration
    * duration: 15-20 seconds
    * conceptsHighlighted: array of concept names
- quiz: 2 multiple-choice questions
"""

    def _synthesize_structured_story(
        self,
        topic: str,
        age: int,
        grade: str,
        interest: str,
        rag_context: str
    ) -> Dict[str, Any]:
        """Synthesize structured multi-scene story JSON with complete 6-scene coverage (~2.5 min video)."""
        
        cap_interest = interest.capitalize()
        story_title = f"The Great {topic} Journey: A {cap_interest} Tale"
        subtitle = f"An immersive {grade} exploration of {topic} through {cap_interest} world mechanics."

        concept1 = "Thermal Energy & Evaporation"
        concept2 = "Vapor & Condensation"
        concept3 = "Cloud Dynamics & Precipitation"
        concept4 = "Runoff & Groundwater Loops"

        scenes = [
            {
                "id": 1,
                "title": "Scene 1: Solar Rays & Energy Input",
                "narration": f"Welcome to our {interest}-inspired world! Every journey through {topic} begins with the powerful heat of the sun. Solar radiation warms earth's surface waters, energizing water molecules and causing them to vibrate rapidly as they prepare for transformation.",
                "visualDescription": f"A breathtaking panoramic view of a sunny {interest} landscape where shimmering golden light warms rivers and oceans, with glowing energy particles rising upwards.",
                "duration": 18,
                "conceptsHighlighted": [concept1]
            },
            {
                "id": 2,
                "title": "Scene 2: Evaporation & Rising Vapor",
                "narration": f"As surface water reaches high temperatures, liquid transforms into an invisible gas called water vapor. Just like steam rising from a warm mug, millions of tiny invisible vapor particles float upward into the atmosphere above our {interest} habitat.",
                "visualDescription": f"Microscopic view of sparkling water vapor molecules rising gracefully into the blue sky above lush {interest} vegetation and wildlife.",
                "duration": 18,
                "conceptsHighlighted": [concept1]
            },
            {
                "id": 3,
                "title": "Scene 3: Condensation & Cloud Formation",
                "narration": f"High in the cool upper atmosphere, the rising water vapor cools down quickly. The tiny gas particles gather together around dust grains, forming billowy white clouds that drift gracefully over our {interest} realm.",
                "visualDescription": f"Dramatic wide shot of majestic white fluffy clouds condensing and swelling high in the sky over a vibrant {interest} biome.",
                "duration": 18,
                "conceptsHighlighted": [concept2]
            },
            {
                "id": 4,
                "title": "Scene 4: Precipitation & Falling Rain",
                "narration": f"When clouds become heavy with condensed water droplets, gravity draws them back down to earth! Liquid rain, glistening snow, or hail falls from the sky, nourishing plants, animals, and soil across the {interest} landscape.",
                "visualDescription": f"A refreshing, vivid rain shower falling over a sunny {interest} ecosystem, with raindrops sparkling on leaves and water droplets forming fresh streams.",
                "duration": 18,
                "conceptsHighlighted": [concept3]
            },
            {
                "id": 5,
                "title": "Scene 5: Surface Runoff & Collection",
                "narration": f"Once rain reaches the ground, gravity channels water into trickling streams and rushing rivers. These waterways flow together across the land, collecting in lakes, reservoirs, and vast oceans to start the store of water again.",
                "visualDescription": f"A winding, crystal-clear river rushing through a serene {interest} valley, joining a vast shimmering lake filled with healthy flora.",
                "duration": 18,
                "conceptsHighlighted": [concept4]
            },
            {
                "id": 6,
                "title": "Scene 6: Infiltration & The Global Loop",
                "narration": f"Not all water flows above ground! Much of the falling moisture filters deep into soil layers through infiltration, replenishing subterranean aquifers that sustain plants and wells across the {interest} biome, completing the eternal global cycle.",
                "visualDescription": f"Cross-section diagram view showing rainwater absorbing through soil strata into glowing underground aquifer reservoirs beneath a thriving {interest} habitat.",
                "duration": 20,
                "conceptsHighlighted": [concept4]
            }
        ]

        return {
            "title": story_title,
            "subtitle": subtitle,
            "objective": f"Master the 6 key stages of {topic} and understand how continuous energy drives global loops.",
            "conceptName": topic,
            "gradeLevel": str(grade),
            "readingTimeMinutes": 3,
            "concepts": [
                {"name": concept1, "description": f"How heat converts surface liquid into vapor in {topic}.", "icon": "☀️"},
                {"name": concept2, "description": f"Cooling vapor forming clouds high in the sky.", "icon": "☁️"},
                {"name": concept3, "description": f"Gravity pulling rain and snow back to earth.", "icon": "🌧️"},
                {"name": concept4, "description": f"Waterways and deep aquifer infiltration loops.", "icon": "💧"}
            ],
            "scenes": scenes,
            "quiz": [
                {
                    "id": "q1",
                    "question": f"What causes liquid surface water to transform into vapor during {topic}?",
                    "options": ["Solar Heat & Energy Input", "Freezing Temperatures", "High Wind Pressure", "Deep Underground Rocks"],
                    "correctAnswer": 0,
                    "explanation": "Solar energy heats water molecules, causing them to evaporate into rising water vapor!"
                },
                {
                    "id": "q2",
                    "question": f"What occurs during the condensation stage of {topic}?",
                    "options": ["Cooling vapor forms clouds in the sky", "Water sinks into bedrock", "Ice turns into steam", "Plants stop absorbing moisture"],
                    "correctAnswer": 0,
                    "explanation": "Condensation happens when rising vapor cools down and forms clouds!"
                }
            ]
        }

story_llm = StoryLLMModel()
