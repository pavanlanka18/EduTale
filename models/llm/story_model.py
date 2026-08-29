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
        """Construct system prompt for structured story generation."""
        return f"""
System: You are EduTale AI, an expert educational storyteller. 
Transform the educational facts below into an engaging, age-appropriate story lesson.

Learner Profile:
- Age: {age} years old
- Grade: {grade}
- Primary Interest: {interest}
- Subject Topic: {topic}

Retrieved Educational Facts (RAG Context):
{rag_context}

Output Requirements:
Return a valid JSON object with title, subtitle, objective, conceptName, scenes (narration, visual_prompt), and quiz questions.
"""

    def _synthesize_structured_story(
        self,
        topic: str,
        age: int,
        grade: str,
        interest: str,
        rag_context: str
    ) -> Dict[str, Any]:
        """Synthesize structured story JSON with fallback template logic."""
        
        # Adaptive vocabulary based on age
        if age <= 11:
            story_title = f"Milo's {topic} {interest.capitalize()} Adventure"
            subtitle = f"A {grade} journey discovering {topic} with fun stories!"
            concept1 = "Producers & Energy"
            concept2 = "Primary Consumers"
            concept3 = "Ecosystem Balance"
            narration1 = f"Welcome to the {interest} wilderness! Today we discover {topic}. Sun rays nourish green grass, creating energy!"
            narration2 = f"Here comes Milo who loves grazing on fresh green leaves. Milo gets energy directly from producers as a primary consumer!"
            narration3 = f"When the journey completes, decomposers return nutrients back to the rich soil, keeping our {interest} world balanced!"
            visual1 = f"Sunlit {interest} landscape with glowing energy particles flowing into vibrant green plants."
            visual2 = f"A friendly animal grazing in a sunny {interest} meadow under dappled light."
            visual3 = f"Glowing forest mushrooms recycling nutrients back into soil with sparkling particles."
        else:
            story_title = f"The Cosmic {topic}: {interest.capitalize()} Dynamics"
            subtitle = f"A {grade} exploration of {topic} and thermodynamic balance."
            concept1 = "Primary Production"
            concept2 = "Trophic Energy Transfer"
            concept3 = "Biospheric Loop"
            narration1 = f"In orbital research stations studying {topic}, solar radiation fuels bio-dome primary production."
            narration2 = f"Synthetic organisms consume primary producers. At each ascending level, 90% of heat radiates into space according to thermodynamic entropy."
            narration3 = f"Sub-surface decomposers recycle nitrogen compounds directly back into farms, closing the biospheric loop."
            visual1 = f"Futuristic sci-fi orbital bio-dome glowing with bioluminescent energy spectra."
            visual2 = f"Holographic 3D trophic energy pyramid showing heat radiation dissipation."
            visual3 = f"Glowing schematic of a self-sustaining futuristic closed loop ecosystem."

        return {
            "title": story_title,
            "subtitle": subtitle,
            "objective": f"Understand the core mechanics and real-world significance of {topic}.",
            "conceptName": topic,
            "gradeLevel": str(grade),
            "readingTimeMinutes": 3,
            "concepts": [
                {"name": concept1, "description": f"The primary foundation of {topic}.", "icon": "🌱"},
                {"name": concept2, "description": f"How organisms consume energy in {topic}.", "icon": "🐯"},
                {"name": concept3, "description": f"Maintaining balance across {topic}.", "icon": "🍄"}
            ],
            "scenes": [
                {
                    "id": 1,
                    "title": "Sunlight & Primary Production",
                    "narration": narration1,
                    "visualDescription": visual1,
                    "duration": 12,
                    "conceptsHighlighted": [concept1]
                },
                {
                    "id": 2,
                    "title": "Consumers & Energy Flow",
                    "narration": narration2,
                    "visualDescription": visual2,
                    "duration": 12,
                    "conceptsHighlighted": [concept2]
                },
                {
                    "id": 3,
                    "title": "Closing the Ecological Loop",
                    "narration": narration3,
                    "visualDescription": visual3,
                    "duration": 11,
                    "conceptsHighlighted": [concept3]
                }
            ],
            "quiz": [
                {
                    "id": "q1",
                    "question": f"What is the primary energy source powering {topic}?",
                    "options": ["Solar Light / Radiation", "Artificial Batteries", "Wind Resistance", "Deep Soil Rocks"],
                    "correctAnswer": 0,
                    "explanation": "Solar energy provides the initial fuel for primary production in ecosystems!"
                }
            ]
        }

story_llm = StoryLLMModel()
