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

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-food-chain-milo',
    title: "Milo's Jungle Food Chain Adventure",
    subtitle: "A Grade 5 journey exploring how solar energy flows through wild animals.",
    objective: "Understand producers, primary consumers, apex predators, and energy transfer in ecosystems.",
    conceptName: "Ecosystem Food Chains",
    learnerProfile: {
      name: "Alex",
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
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=1000&q=80",
        duration: 12,
        conceptsHighlighted: ["Producer", "Photosynthesis"]
      },
      {
        id: 2,
        title: "Meet Milo the Friendly Zebra",
        narration: "Along comes Milo the curious zebra! Milo loves munching on lush, sun-ripened green grass. Because Milo gets his energy directly by eating plants, scientists call him a Primary Consumer or Herbivore.",
        visualDescription: "A zebra grazing peacefully in a sunlit meadow with colorful butterflies fluttering nearby.",
        imageUrl: "https://images.unsplash.com/photo-1526095179574-86e5458421e0?auto=format&fit=crop&w=1000&q=80",
        duration: 11,
        conceptsHighlighted: ["Consumer", "Herbivore"]
      },
      {
        id: 3,
        title: "The Watchful Tiger in the Shadows",
        narration: "Deep within the emerald tall grass, Tara the swift tiger leaps softly. Tara is a Secondary Consumer and Carnivore. She hunts plant-eaters to gain the energy originally stored in the grasses.",
        visualDescription: "A striking tiger crouched gracefully in tall golden-green jungle grass under dappled sunlight.",
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80",
        duration: 12,
        conceptsHighlighted: ["Secondary Consumer", "Carnivore"]
      },
      {
        id: 4,
        title: "The Great Circle of Life",
        narration: "When living things complete their journey, decomposers like tiny forest mushrooms return essential nutrients back to the rich soil. This allows new plants to grow, keeping the ecosystem forever balanced!",
        visualDescription: "Glowing mushrooms on a forest floor, with sparkling nutrient threads linking soil to sprouting trees.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
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
      },
      {
        id: 'q2',
        question: "Why is Milo the Zebra called a Primary Consumer?",
        options: ["He makes his own food", "He eats producers (plants)", "He hunts tigers", "He lives underground"],
        correctAnswer: 1,
        explanation: "Animals that eat plants directly are primary consumers or herbivores."
      }
    ],
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
      { name: "10% Energy Rule", description: "Only ~10% of energy transfers up to the next trophic level.", icon: "⚡" },
      { name: "Biosphere Dynamic", description: "Self-sustaining biological systems operating in closed environments.", icon: "🌌" }
    ],
    scenes: [
      {
        id: 1,
        title: "Stellar Energy Generation",
        narration: "In orbital hydroponic stations surrounding planet Kepler-186f, solar radiation illuminates bio-domes. Solar photons fuel primary metabolic production in engineered algae systems.",
        visualDescription: "Futuristic space habitat domes orbiting a distant planet glowing with interior green bioluminescence.",
        imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
        duration: 13,
        conceptsHighlighted: ["Solar Radiance", "Primary Production"]
      },
      {
        id: 2,
        title: "Trophic Level Compression",
        narration: "Synthetic organisms graze upon the algae. At each ascending trophic level, 90% of heat energy radiates into space according to thermodynamic entropy, leaving 10% for cellular growth.",
        visualDescription: "Holographic 3D trophic pyramid floating inside a space laboratory showing energy dissipation spectra.",
        imageUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80",
        duration: 14,
        conceptsHighlighted: ["10% Energy Rule", "Thermodynamics"]
      },
      {
        id: 3,
        title: "Biospheric Closed Loops",
        narration: "Sub-surface decomposers recycle nitrogen compounds directly back to hydro-farms, closing the thermodynamic loop and proving that ecosystems survive through continuous energy conversion.",
        visualDescription: "Intricate glowing schematic of a self-sustaining space colony ecological closed loop.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
        duration: 13,
        conceptsHighlighted: ["Closed Loop Biosphere", "Ecosystem Entropy"]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: "How much energy is typically transferred between trophic levels?",
        options: ["100%", "50%", "Approximately 10%", "0.1%"],
        correctAnswer: 2,
        explanation: "Due to metabolic heat loss, roughly 10% of energy transfers to the next trophic level."
      }
    ],
    createdAt: new Date().toISOString()
  }
];

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
      name: "Alex",
      age: 10,
      grade: "Grade 5",
      interests: ["animals", "space"]
    };
  }

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }

  getStories(): Story[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_STORIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return MOCK_STORIES;
  }

  getStoryById(id: string): Story | undefined {
    return this.getStories().find(s => s.id === id) || MOCK_STORIES.find(s => s.id === id);
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

  generateCustomStory(profile: StudentProfile, material: LearningMaterial): Promise<Story> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const primaryInterest = profile.interests[0] || 'animals';
        const topicName = material.extractedTopic || material.name.replace(/\.[^/.]+$/, "") || "Scientific Concepts";

        let storyTitle = `${profile.name || 'Learner'}'s ${topicName} Adventure`;
        let visualTheme = "jungle";
        let image1 = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80";
        let image2 = "https://images.unsplash.com/photo-1526095179574-86e5458421e0?auto=format&fit=crop&w=1000&q=80";
        let image3 = "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80";

        if (primaryInterest === 'space') {
          storyTitle = `The Galactic Quest of ${topicName}`;
          visualTheme = "cosmic space";
          image1 = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80";
          image2 = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80";
          image3 = "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80";
        } else if (primaryInterest === 'sports') {
          storyTitle = `${topicName}: The Ultimate Championship`;
          image1 = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80";
          image2 = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80";
          image3 = "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1000&q=80";
        } else if (primaryInterest === 'games') {
          storyTitle = `Leveling Up ${topicName}: The Quest`;
          image1 = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80";
          image2 = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80";
          image3 = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80";
        }

        const newStory: Story = {
          id: `custom-story-${Date.now()}`,
          title: storyTitle,
          subtitle: `Tailored for ${profile.age} year old (${profile.grade}) exploring ${primaryInterest}.`,
          objective: `Understand the fundamentals of ${topicName} through a personalized ${visualTheme} narrative.`,
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
              narration: `Welcome aboard! Today we dive into ${topicName}, customized for a ${profile.grade} student with a passion for ${primaryInterest}. Let's examine our starting baseline!`,
              visualDescription: `A high-vibrancy scene illustrating ${topicName} with clear thematic elements of ${primaryInterest}.`,
              imageUrl: image1,
              duration: 11,
              conceptsHighlighted: ["Core Principle"]
            },
            {
              id: 2,
              title: "The Main Discovery",
              narration: `Notice how each part interacts dynamically! Just like in your favorite ${primaryInterest} adventures, ${topicName} relies on balance and transfer of energy.`,
              visualDescription: `An energetic close-up visual demonstrating how ${topicName} operates.`,
              imageUrl: image2,
              duration: 12,
              conceptsHighlighted: ["Key Mechanics"]
            },
            {
              id: 3,
              title: "Mastery & Real-World Impact",
              narration: `Congratulations! You have unlocked the secrets of ${topicName}. Now you can explain this concept effortlessly to your friends!`,
              visualDescription: `A celebratory ending scene glowing with bright victory particles and visual clarity.`,
              imageUrl: image3,
              duration: 10,
              conceptsHighlighted: ["Practical Application"]
            }
          ],
          quiz: [
            {
              id: 'q-custom-1',
              question: `What is the main takeaway about ${topicName}?`,
              options: [
                `It operates through connected principles and balance`,
                `It only happens in laboratory settings`,
                `It never changes over time`,
                `It requires zero energy`
              ],
              correctAnswer: 0,
              explanation: `All physical and natural concepts rely on interconnected rules and balanced interactions!`
            }
          ],
          createdAt: new Date().toISOString()
        };

        this.saveStory(newStory);
        resolve(newStory);
      }, 3000);
    });
  }
}

export const storageService = new StorageService();
