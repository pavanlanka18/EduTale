import { Story, StudentProfile, LearningMaterial, InterestOption, GradeOption } from '../types';

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'animals', label: 'Animals', emoji: '🐾', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'space', label: 'Space', emoji: '🚀', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'games', label: 'Gaming', emoji: '🎮', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦖', color: 'bg-lime-100 text-lime-800 border-lime-300' },
  { id: 'art', label: 'Art & Design', emoji: '🎨', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'science', label: 'Inventions', emoji: '🔬', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'nature', label: 'Nature', emoji: '🌍', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'music', label: 'Music', emoji: '🎵', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' },
  { id: 'stories', label: 'Fantasy & Magic', emoji: '🪄', color: 'bg-violet-100 text-violet-800 border-violet-300' },
];

export const GRADE_OPTIONS: GradeOption[] = [
  { id: 'Grade 1', label: 'Grade 1', level: 'elementary' },
  { id: 'Grade 2', label: 'Grade 2', level: 'elementary' },
  { id: 'Grade 3', label: 'Grade 3', level: 'elementary' },
  { id: 'Grade 4', label: 'Grade 4', level: 'elementary' },
  { id: 'Grade 5', label: 'Grade 5', level: 'elementary' },
  { id: 'Grade 6', label: 'Grade 6', level: 'middle' },
  { id: 'Grade 7', label: 'Grade 7', level: 'middle' },
  { id: 'Grade 8', label: 'Grade 8', level: 'middle' },
  { id: 'Grade 9', label: 'Grade 9', level: 'high' },
  { id: 'Grade 10', label: 'Grade 10', level: 'high' },
  { id: 'Grade 11', label: 'Grade 11', level: 'high' },
  { id: 'Grade 12', label: 'Grade 12', level: 'high' },
];

export function getDynamicImageForScene(interest: string = '', topic: string = '', sceneIdx: number = 0): string {
  const normInterest = (interest || '').toLowerCase();
  const normTopic = (topic || '').toLowerCase();

  // Water Cycle / Nature / Earth Science
  if (normTopic.includes('water') || normTopic.includes('cycle') || normInterest.includes('nature')) {
    const images = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80", // Sunlit Surface
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1000&q=80", // Rising Mist
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80", // Cloud Formation
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80", // Rain & Precipitation
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80", // Rushing River Runoff
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80"  // Groundwater & Springs
    ];
    return images[sceneIdx % images.length];
  }

  // Space / Astronomy
  if (normInterest.includes('space') || normTopic.includes('space') || normTopic.includes('cosmic') || normTopic.includes('orbit')) {
    const images = [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80", // Nebula
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80", // Earth from Orbit
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80", // Deep Galaxy
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80", // Space Habitat
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80", // Star Cluster
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80"  // Planet Atmosphere
    ];
    return images[sceneIdx % images.length];
  }

  // Inventions / Physics / Technology
  if (normInterest.includes('inventions') || normTopic.includes('energy') || normTopic.includes('tech') || normTopic.includes('physics')) {
    const images = [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80", // Science Lab
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", // Circuit Board
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80", // Laboratory Optics
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80", // Futuristic Robotics
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80", // Solar Panels
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"  // Glowing Network
    ];
    return images[sceneIdx % images.length];
  }

  // Default Animals / Jungle / Nature
  const images = [
    "https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=1000&q=80", // Sunlight Canopy
    "https://images.unsplash.com/photo-1526095179574-86e5458421e0?auto=format&fit=crop&w=1000&q=80", // Zebra Meadow
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80", // Tiger in Grass
    "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1000&q=80", // Rain Shower
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80", // Rushing Stream
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"  // Glowing Forest
  ];
  return images[sceneIdx % images.length];
}

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-food-chain-milo',
    title: "Milo's Jungle Food Chain Adventure",
    subtitle: "A Grade 5 journey exploring how solar energy flows through wild animals.",
    objective: "Understand producers, primary consumers, apex predators, and energy transfer in ecosystems.",
    conceptName: "Ecosystem Food Chains",
    learnerProfile: {
      name: "Student",
      age: 10,
      grade: "Grade 5",
      interests: ["animals", "nature"]
    },
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    readingTimeMinutes: 3,
    gradeLevel: "Grade 5",
    concepts: [
      { name: "Producer", description: "Plants that convert sunlight into chemical energy.", icon: "🌱" },
      { name: "Consumer", description: "Living creatures that eat plants or other animals.", icon: "🐯" },
      { name: "Decomposer", description: "Organisms that break down dead material back into soil.", icon: "🍄" },
      { name: "Energy Flow", description: "The transfer of energy upward from producers to predators.", icon: "⚡" }
    ],
    scenes: [
      {
        id: 1,
        title: "The Sunlight & Grasslands",
        narration: "High above the vibrant Amazon canopy, giant green fern leaves stretch toward the warm morning sunlight. Leaves absorb solar light to make sweet sugars in a process called photosynthesis. These leafy plants are the ultimate Producers!",
        visualDescription: "Bright jungle canopy bathed in golden sunlight with glowing energy particles flowing into broad green leaves.",
        imageUrl: getDynamicImageForScene("animals", "food chain", 0),
        duration: 12,
        conceptsHighlighted: ["Producer", "Photosynthesis"]
      },
      {
        id: 2,
        title: "Meet Milo the Friendly Zebra",
        narration: "Along comes Milo the curious zebra! Milo loves munching on lush, sun-ripened green grass. Because Milo gets his energy directly by eating plants, scientists call him a Primary Consumer or Herbivore.",
        visualDescription: "A zebra grazing peacefully in a sunlit meadow with colorful butterflies fluttering nearby.",
        imageUrl: getDynamicImageForScene("animals", "food chain", 1),
        duration: 11,
        conceptsHighlighted: ["Consumer", "Herbivore"]
      },
      {
        id: 3,
        title: "The Watchful Tiger in the Shadows",
        narration: "Deep within the emerald tall grass, Tara the swift tiger leaps softly. Tara is a Secondary Consumer and Carnivore. She hunts plant-eaters to gain the energy originally stored in the grasses.",
        visualDescription: "A striking tiger crouched gracefully in tall golden-green jungle grass under dappled sunlight.",
        imageUrl: getDynamicImageForScene("animals", "food chain", 2),
        duration: 12,
        conceptsHighlighted: ["Secondary Consumer", "Carnivore"]
      },
      {
        id: 4,
        title: "The Great Circle of Life",
        narration: "When living things complete their journey, decomposers like tiny forest mushrooms return essential nutrients back to the rich soil. This allows new plants to grow, keeping the ecosystem forever balanced!",
        visualDescription: "Glowing mushrooms on a forest floor, with sparkling nutrient threads linking soil to sprouting trees.",
        imageUrl: getDynamicImageForScene("animals", "food chain", 3),
        duration: 13,
        conceptsHighlighted: ["Decomposer", "Ecosystem Balance"]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: "What role do plants play in a food chain?",
        options: ["Decomposers", "Producers", "Secondary Consumers", "Apex Predators"],
        correctAnswer: 1,
        explanation: "Plants use sunlight to make their own food through photosynthesis, making them Producers!"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'story-water-cycle-journey',
    title: "The Global Water Cycle Loop",
    subtitle: "A Grade 6 exploration of solar evaporation, cloud condensation, and groundwater aquifers.",
    objective: "Master evaporation, condensation, precipitation, and infiltration loops.",
    conceptName: "Hydrological Cycle",
    learnerProfile: {
      name: "Sam",
      age: 11,
      grade: "Grade 6",
      interests: ["nature", "science"]
    },
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    readingTimeMinutes: 3,
    gradeLevel: "Grade 6",
    concepts: [
      { name: "Evaporation", description: "Sunlight heating water into water vapor.", icon: "☀️" },
      { name: "Condensation", description: "Vapor cooling into clouds.", icon: "☁️" },
      { name: "Precipitation", description: "Rain, snow, or hail falling to Earth.", icon: "🌧️" }
    ],
    scenes: [
      {
        id: 1,
        title: "Solar Heat & Lake Evaporation",
        narration: "Sunlight beams down on a crystal lake, energizing water molecules until they turn into rising vapor mist.",
        visualDescription: "Sunlit mountain lake with mist gently rising into the morning sky.",
        imageUrl: getDynamicImageForScene("nature", "water cycle", 0),
        duration: 14,
        conceptsHighlighted: ["Evaporation"]
      },
      {
        id: 2,
        title: "Clouds & Atmospheric Condensation",
        narration: "As vapor floats into the cool sky, it cools down and clumps together to form giant fluffy rainclouds.",
        visualDescription: "Dramatic view of billowing white storm clouds gathering over mountain peaks.",
        imageUrl: getDynamicImageForScene("nature", "water cycle", 2),
        duration: 15,
        conceptsHighlighted: ["Condensation"]
      },
      {
        id: 3,
        title: "Precipitation & Rushing Rivers",
        narration: "Heavy clouds release rain droplets that feed rushing rivers and seep into underground aquifers.",
        visualDescription: "A rushing river flowing through a lush pine forest during a fresh rainfall.",
        imageUrl: getDynamicImageForScene("nature", "water cycle", 4),
        duration: 16,
        conceptsHighlighted: ["Precipitation"]
      }
    ],
    quiz: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'story-cosmic-ecosystem',
    title: "The Cosmic Ecosystem: Galactic Energy Transfers",
    subtitle: "A Grade 9 astrophysics-themed exploration of food webs and thermodynamic energy balance.",
    objective: "Master primary production, trophic levels, energy loss, and planetary ecosystem balance.",
    conceptName: "Thermodynamics in Trophic Systems",
    learnerProfile: {
      name: "Jordan",
      age: 14,
      grade: "Grade 9",
      interests: ["space", "science"]
    },
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    readingTimeMinutes: 4,
    gradeLevel: "Grade 9",
    concepts: [
      { name: "Solar Radiance", description: "Electromagnetic energy emitted by stellar fusion.", icon: "☀️" },
      { name: "Trophic Levels", description: "Hierarchical steps in an ecosystem's food pyramid.", icon: "📊" },
      { name: "10% Energy Rule", description: "Only ~10% of energy transfers up to the next trophic level.", icon: "⚡" }
    ],
    scenes: [
      {
        id: 1,
        title: "Stellar Energy Generation",
        narration: "In orbital hydroponic stations surrounding planet Kepler-186f, solar radiation illuminates bio-domes. Solar photons fuel primary metabolic production in engineered algae systems.",
        visualDescription: "Futuristic space habitat domes orbiting a distant planet glowing with interior green bioluminescence.",
        imageUrl: getDynamicImageForScene("space", "cosmic", 0),
        duration: 13,
        conceptsHighlighted: ["Solar Radiance", "Primary Production"]
      },
      {
        id: 2,
        title: "Trophic Level Compression",
        narration: "Synthetic organisms graze upon the algae. At each ascending trophic level, 90% of heat energy radiates into space according to thermodynamic entropy, leaving 10% for cellular growth.",
        visualDescription: "Holographic 3D trophic pyramid floating inside a space laboratory showing energy dissipation spectra.",
        imageUrl: getDynamicImageForScene("space", "cosmic", 1),
        duration: 14,
        conceptsHighlighted: ["10% Energy Rule", "Thermodynamics"]
      },
      {
        id: 3,
        title: "Biospheric Closed Loops",
        narration: "Sub-surface decomposers recycle nitrogen compounds directly back to hydro-farms, closing the thermodynamic loop and proving that ecosystems survive through continuous energy conversion.",
        visualDescription: "Intricate glowing schematic of a self-sustaining space colony ecological closed loop.",
        imageUrl: getDynamicImageForScene("space", "cosmic", 2),
        duration: 13,
        conceptsHighlighted: ["Closed Loop Biosphere"]
      }
    ],
    quiz: [],
    createdAt: new Date().toISOString()
  }
];

const API_BASE_URL = 'http://localhost:8000';

class StorageService {
  private STORAGE_KEY_PROFILE = 'edutale_user_profile';
  private STORAGE_KEY_STORIES = 'edutale_saved_stories';

  getSavedProfile(): StudentProfile {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_PROFILE);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return {
      name: "",
      age: 10,
      grade: "Grade 5",
      interests: ["animals", "space"]
    };
  }

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }

  getStories(): Story[] {
    let list: Story[] = MOCK_STORIES;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_STORIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {
      // fallback
    }

    // Ensure every story has a unique, topic/interest-aligned cover image and scene images
    return list.map((story, idx) => {
      const primaryInterest = story.learnerProfile?.interests?.[0] || 'animals';
      const topicName = story.conceptName || story.title || 'Science';
      const dynamicCover = getDynamicImageForScene(primaryInterest, topicName, idx);

      const updatedScenes = (story.scenes || []).map((scene, sIdx) => ({
        ...scene,
        imageUrl: (scene.imageUrl && !scene.imageUrl.includes('photo-1516426122078-c23e76319801'))
          ? scene.imageUrl 
          : getDynamicImageForScene(primaryInterest, topicName, sIdx)
      }));

      return {
        ...story,
        coverImage: dynamicCover,
        scenes: updatedScenes
      };
    });
  }

  getStoryById(id: string): Story | undefined {
    return this.getStories().find(s => s.id === id) || MOCK_STORIES.find(s => s.id === id);
  }


  // RAG Document Upload methods
  async uploadDocumentFile(file: File): Promise<{ document_id: string; filename: string; chunk_count: number }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ detail: 'Failed to upload document' }));
      throw new Error(errData.detail || errData.error || 'Failed to upload document');
    }
    return response.json();
  }

  async uploadDocumentText(text: string): Promise<{ document_id: string; filename: string; chunk_count: number }> {
    const formData = new FormData();
    formData.append('text', text);
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ detail: 'Failed to upload text' }));
      throw new Error(errData.detail || errData.error || 'Failed to upload text');
    }
    return response.json();
  }

  async generateStoryWithRAG(payload: {
    document_id: string | null;
    topic: string;
    profile: { age: number; grade: number; interest: string };
  }): Promise<Story> {
    const response = await fetch(`${API_BASE_URL}/api/v1/story/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ detail: 'Failed to generate story' }));
      throw new Error(errData.detail || errData.error || 'Failed to generate story with RAG');
    }
    const data = await response.json();
    
    const topicName = data.topic || payload.topic || "Educational Lesson";
    const primaryInterest = payload.profile.interest || "animals";

    const newStory: Story = {
      id: `story-rag-${Date.now()}`,
      title: `${topicName} Adventure`,
      subtitle: `Multi-scene story generated with RAG source material for Grade ${payload.profile.grade} learner.`,
      objective: `Master the complete mechanics and multi-stage process of ${topicName}.`,
      conceptName: topicName,
      learnerProfile: {
        name: "Learner",
        age: payload.profile.age,
        grade: `Grade ${payload.profile.grade}`,
        interests: [primaryInterest],
      },
      coverImage: getDynamicImageForScene(primaryInterest, topicName, 0),
      readingTimeMinutes: 3,
      gradeLevel: `Grade ${payload.profile.grade}`,
      concepts: [
        { name: "Thermal Heating & Evaporation", description: `Solar energy converts liquid into gas.`, icon: "☀️" },
        { name: "Cooling & Condensation", description: `Vapor cools into cloud droplets.`, icon: "☁️" },
        { name: "Precipitation", description: `Rain and snow fall to nourish ecosystems.`, icon: "🌧️" },
        { name: "Runoff & Groundwater Loops", description: `Water channels into aquifers and oceans.`, icon: "💧" }
      ],
      scenes: [
        {
          id: 1,
          title: "Scene 1: Solar Heat & Energy Input",
          narration: typeof data.story === 'string' ? data.story : `Welcome to our ${primaryInterest}-inspired adventure! Every global loop in ${topicName} begins when solar heat warms earth's surface waters. Energetic molecules vibrate rapidly as they prepare for atmospheric transformation.`,
          visualDescription: `Sunlit panoramic view of rivers and oceans warming under bright sunlight in a ${primaryInterest} setting.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 0),
          duration: 18,
          conceptsHighlighted: ["Thermal Heating & Evaporation"],
        },
        {
          id: 2,
          title: "Scene 2: Rising Water Vapor",
          narration: `As surface liquid reaches warm temperatures, it converts into invisible water vapor gas. Millions of tiny vapor particles ascend high into the sky above our ${primaryInterest} ecosystem.`,
          visualDescription: `Microscopic view of sparkling water vapor molecules rising gracefully into the blue sky.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 1),
          duration: 18,
          conceptsHighlighted: ["Thermal Heating & Evaporation"],
        },
        {
          id: 3,
          title: "Scene 3: Condensation & Cloud Formation",
          narration: `High in the cool atmosphere, rising vapor cools down quickly. The tiny gas particles gather together around dust grains, forming billowy white clouds that drift gracefully above the ${primaryInterest} landscape.`,
          visualDescription: `Wide shot of fluffy white clouds gathering and swelling in the cool atmosphere over mountains.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 2),
          duration: 18,
          conceptsHighlighted: ["Cooling & Condensation"],
        },
        {
          id: 4,
          title: "Scene 4: Precipitation & Falling Moisture",
          narration: `When clouds become heavy with condensed water droplets, gravity draws them back down! Refreshing rain and sparkling snow fall to nourish plants, animals, and soil across our ${primaryInterest} biome.`,
          visualDescription: `Refreshing rain shower falling over a vibrant ecosystem with water droplets glistening on leaves.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 3),
          duration: 18,
          conceptsHighlighted: ["Precipitation"],
        },
        {
          id: 5,
          title: "Scene 5: Surface Runoff & Collection",
          narration: `Once rainfall touches down, gravity channels streams into rushing rivers. These waterways flow together across the terrain, collecting in lakes and oceans to restart the eternal cycle.`,
          visualDescription: `A crystal-clear river winding through a valley into a glistening lake surrounded by flora.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 4),
          duration: 18,
          conceptsHighlighted: ["Runoff & Groundwater Loops"],
        },
        {
          id: 6,
          title: "Scene 6: Infiltration & The Global Loop",
          narration: `Much of the falling moisture filters deep into underground soil layers through infiltration, replenishing sub-surface aquifers that sustain life across the ${primaryInterest} biome!`,
          visualDescription: `Diagrammatic cross-section showing rainwater absorbing into underground aquifers beneath lush soil.`,
          imageUrl: getDynamicImageForScene(primaryInterest, topicName, 5),
          duration: 20,
          conceptsHighlighted: ["Runoff & Groundwater Loops"],
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: `What causes surface water to transform into vapor during ${topicName}?`,
          options: ["Solar Energy & Heat Input", "Freezing Air Temperatures", "High Wind Speeds", "Heavy Ground Rocks"],
          correctAnswer: 0,
          explanation: `Solar radiation provides the thermal energy that turns surface liquid into vapor!`,
        }
      ],
      createdAt: new Date().toISOString(),
    };

    this.saveStory(newStory);
    return newStory;
  }

  saveStory(story: Story): void {
    const stories = this.getStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.unshift(story);
    }
    localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(stories));
  }

  async generateCustomStory(profile: StudentProfile, material: LearningMaterial): Promise<Story> {
    try {
      // Attempt live call to FastAPI Backend API
      const response = await fetch(`${API_BASE_URL}/api/v1/lessons/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: material.extractedTopic || material.name || "Custom Lesson",
          content: material.content || "Photosynthesis and Ecosystem Food Chains",
          student_id: "student-sample-1",
          content_type: material.type || "text",
          student_profile_override: profile
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.lesson_id) {
          // Construct Story object from backend response
          const primaryInterest = profile.interests[0] || 'animals';
          const topicName = material.extractedTopic || material.name || "Scientific Concepts";

          const backendStory: Story = {
            id: data.lesson_id,
            title: `${profile.name || 'Learner'}'s ${topicName} Adventure`,
            subtitle: `Generated by EduTale AI Backend for ${profile.age} year old (${profile.grade}).`,
            objective: `Understand the core principles of ${topicName} through personalized narration.`,
            conceptName: topicName,
            learnerProfile: profile,
            coverImage: getDynamicImageForScene(primaryInterest, topicName, 0),
            readingTimeMinutes: 3,
            gradeLevel: profile.grade,
            concepts: [
              { name: "Core Principle", description: `Primary mechanism of ${topicName}.`, icon: "🌱" },
              { name: "Key Interaction", description: `How elements transfer energy in ${topicName}.`, icon: "🐯" },
              { name: "System Balance", description: `Maintaining ecological equilibrium.`, icon: "🍄" }
            ],
            scenes: [
              {
                id: 1,
                title: "Setting the Baseline",
                narration: `Welcome! Today we explore ${topicName}, tailored for your interest in ${primaryInterest}.`,
                visualDescription: `Sunlit scene demonstrating ${topicName}.`,
                imageUrl: getDynamicImageForScene(primaryInterest, topicName, 0),
                duration: 12,
                conceptsHighlighted: ["Core Principle"]
              },
              {
                id: 2,
                title: "Active Transfer & Dynamics",
                narration: `Notice how each element interacts. Just like in ${primaryInterest}, energy flows continuously!`,
                visualDescription: `Dynamic interaction scene for ${topicName}.`,
                imageUrl: getDynamicImageForScene(primaryInterest, topicName, 1),
                duration: 12,
                conceptsHighlighted: ["Key Interaction"]
              },
              {
                id: 3,
                title: "Completing the Cycle",
                narration: `Decomposers return vital nutrients back into the cycle, keeping the system balanced!`,
                visualDescription: `Glowing forest floor recycling nutrients into new growth.`,
                imageUrl: getDynamicImageForScene(primaryInterest, topicName, 2),
                duration: 13,
                conceptsHighlighted: ["System Balance"]
              }
            ],
            quiz: [
              {
                id: 'q1',
                question: `What is the primary takeaway regarding ${topicName}?`,
                options: ["It relies on balanced energy flow", "It requires zero input", "It never changes"],
                correctAnswer: 0,
                explanation: "All ecological concepts depend on continuous energy transfer and balance!"
              }
            ],
            createdAt: new Date().toISOString()
          };

          this.saveStory(backendStory);
          return backendStory;
        }
      }
    } catch (e) {
      console.warn("Backend API offline; falling back to local story synthesis.", e);
    }

    // Fallback local synthesis
    return new Promise((resolve) => {
      setTimeout(() => {
        const primaryInterest = profile.interests[0] || 'animals';
        const topicName = material.extractedTopic || material.name.replace(/\.[^/.]+$/, "") || "Scientific Concepts";

        let storyTitle = `${profile.name || 'Learner'}'s ${topicName} Adventure`;
        let image1 = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80";

        const newStory: Story = {
          id: `custom-story-${Date.now()}`,
          title: storyTitle,
          subtitle: `Tailored for ${profile.age} year old (${profile.grade}) exploring ${primaryInterest}.`,
          objective: `Understand the fundamentals of ${topicName}.`,
          conceptName: topicName,
          learnerProfile: profile,
          coverImage: image1,
          readingTimeMinutes: 3,
          gradeLevel: profile.grade,
          concepts: [
            { name: "Core Principle", description: `The primary foundation of ${topicName}.`, icon: "💡" },
            { name: "Key Mechanics", description: `How ${topicName} works in real-world scenarios.`, icon: "⚙️" },
            { name: "Practical Application", description: `Why understanding ${topicName} helps solve big challenges.`, icon: "🎯" }
          ],
          scenes: [
            {
              id: 1,
              title: "Setting the Stage",
              narration: `Welcome aboard! Today we dive into ${topicName}, customized for a ${profile.grade} student with a passion for ${primaryInterest}.`,
              visualDescription: `A high-vibrancy scene illustrating ${topicName}.`,
              imageUrl: image1,
              duration: 11,
              conceptsHighlighted: ["Core Principle"]
            }
          ],
          quiz: [],
          createdAt: new Date().toISOString()
        };

        this.saveStory(newStory);
        resolve(newStory);
      }, 1500);
    });
  }

  async uploadFileAndExtract(file: File, studentId: string = "student-sample-1"): Promise<LearningMaterial> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('student_id', studentId);

      const response = await fetch(`${API_BASE_URL}/api/v1/lessons/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return {
          type: file.type.includes('pdf') ? 'pdf' : 'image',
          name: file.name,
          extractedTopic: data.title || "Uploaded Lesson",
          extractedConcepts: ["Core Principle", "Key Interactions", "Ecosystem Mechanics"],
          fileSize: `${(file.size / 1024).toFixed(1)} KB`
        };
      }
    } catch (e) {
      console.warn("Backend OCR API offline; falling back to local extraction.", e);
    }

    return {
      type: file.type.includes('pdf') ? 'pdf' : 'image',
      name: file.name,
      extractedTopic: "Food Chains & Energy Flow",
      extractedConcepts: ["Producers & Solar Energy", "Primary Consumers", "Apex Predators", "Nutrient Loops"],
      fileSize: `${(file.size / 1024).toFixed(1)} KB`
    };
  }
}

export const storageService = new StorageService();
