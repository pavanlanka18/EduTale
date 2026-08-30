from abc import ABC, abstractmethod
from dataclasses import dataclass
import os
import re
import logging
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger("edutale.models.story")


def build_prompt(age: int, grade: int, interest: str, context: Optional[str] = None) -> str:
    """Build prompt format for story model.
    
    If context is None or empty, returns the exact string format used during fine-tuning.
    If context is provided, appends the Educational Context section.
    """
    if context and context.strip():
        return f"""Instruction: Create an engaging story tailored to a student's profile

Input: Age: {age}, Grade: {grade}, Interest: {interest}

Educational Context: {context.strip()}

Output:"""

    return f"""Instruction: Create an engaging story tailored to a student's profile

Input: Age: {age}, Grade: {grade}, Interest: {interest}

Output:"""


@dataclass
class GenerationConfig:
    max_new_tokens: int = 400
    temperature: float = 0.8
    top_p: float = 0.9
    repetition_penalty: float = 1.1


class StoryModel(ABC):
    @abstractmethod
    def generate(self, age: int, grade: int, interest: str, context: Optional[str] = None) -> str:
        """Generate a story based on age, grade, interest, and optional context."""
        pass

    @abstractmethod
    def health(self) -> bool:
        """Check if the model or endpoint is healthy/available."""
        pass


class LocalStoryModel(StoryModel):
    def __init__(
        self,
        base_model: str = "Qwen/Qwen2.5-3B-Instruct",
        adapter: str = "Pavanlanka/edutale-story-adapter",
        generation: Optional[Dict[str, Any]] = None,
    ):
        import torch
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel

        self.gen_config = GenerationConfig(**(generation or {}))

        self.tokenizer = AutoTokenizer.from_pretrained(base_model)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        base = AutoModelForCausalLM.from_pretrained(
            base_model,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        self.model = PeftModel.from_pretrained(base, adapter)
        self.model.eval()
        self.model.config.use_cache = True

    def generate(self, age: int, grade: int, interest: str, context: Optional[str] = None) -> str:
        import torch

        prompt = build_prompt(age, grade, interest, context=context)
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=self.gen_config.max_new_tokens,
                temperature=self.gen_config.temperature,
                top_p=self.gen_config.top_p,
                repetition_penalty=self.gen_config.repetition_penalty,
                do_sample=True,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
            )

        decoded = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        if "Output:" in decoded:
            return decoded.split("Output:")[-1].strip()
        return decoded.strip()

    def health(self) -> bool:
        return self.model is not None


class RemoteStoryModel(StoryModel):
    def __init__(
        self,
        endpoint_url: str,
        generation: Optional[Dict[str, Any]] = None,
    ):
        self.endpoint_url = endpoint_url.rstrip("/")
        self.gen_config = GenerationConfig(**(generation or {}))

    def generate(self, age: int, grade: int, interest: str, context: Optional[str] = None) -> str:
        payload = {
            "age": age,
            "grade": grade,
            "interest": interest,
            "context": context,
            "max_new_tokens": self.gen_config.max_new_tokens,
            "temperature": self.gen_config.temperature,
            "top_p": self.gen_config.top_p,
            "repetition_penalty": self.gen_config.repetition_penalty,
        }
        try:
            url = f"{self.endpoint_url}/generate"
            resp = requests.post(url, json=payload, timeout=10)
            resp.raise_for_status()
            return resp.json()["story"]
        except Exception as e:
            logger.warning(f"Remote story model call to {self.endpoint_url} failed: {e}. Utilizing structured story generator.")
            return self._generate_fallback_story(age, grade, interest, context)

    def _generate_fallback_story(self, age: int, grade: int, interest: str, context: Optional[str] = None) -> str:
        ctx_summary = f"Based on source material: {context[:300]}..." if context else "Exploring key educational concepts."
        return (
            f"Welcome to an exciting adventure tailored for Grade {grade} learners! "
            f"Our journey weaves together your passion for {interest} with fundamental learning concepts. "
            f"{ctx_summary} "
            f"As we navigate through each scene, observe how core principles interact in real-world environments. "
            f"Keep exploring and asking curious questions to master the topic!"
        )

    def health(self) -> bool:
        try:
            url = f"{self.endpoint_url}/health"
            resp = requests.get(url, timeout=5)
            return resp.status_code == 200
        except Exception:
            return False


def create_story_model(config: dict) -> StoryModel:
    story_config = config.get("story_model", {})
    mode = story_config.get("mode", "remote")
    generation = story_config.get("generation", {})

    if mode == "local":
        base_model = story_config.get("base_model", "Qwen/Qwen2.5-3B-Instruct")
        adapter = story_config.get("adapter", "Pavanlanka/edutale-story-adapter")
        return LocalStoryModel(base_model=base_model, adapter=adapter, generation=generation)

    endpoint_url = os.getenv("STORY_MODEL_URL") or story_config.get("endpoint_url")
    if not endpoint_url or endpoint_url.startswith("${"):
        endpoint_url = "http://localhost:8000"

    return RemoteStoryModel(endpoint_url=endpoint_url, generation=generation)
