export interface StudentProfile {
  name?: string;
  age: number;
  grade: string;
  interests: string[];
}

export interface LearningMaterial {
  type: 'pdf' | 'image' | 'text';
  name: string;
  content?: string;
  extractedTopic?: string;
  extractedConcepts?: string[];
  fileSize?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Scene {
  id: number;
  title: string;
  narration: string;
  visualDescription: string;
  imageUrl: string;
  videoUrl?: string;
  duration: number; // in seconds
  conceptsHighlighted: string[];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  conceptName: string;
  learnerProfile: StudentProfile;
  coverImage: string;
  readingTimeMinutes: number;
  gradeLevel: string;
  concepts: {
    name: string;
    description: string;
    icon: string;
  }[];
  scenes: Scene[];
  quiz: QuizQuestion[];
  createdAt: string;
  completed?: boolean;
  userRating?: 'not_understood' | 'getting_there' | 'got_it';
}

export interface InterestOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface GradeOption {
  id: string;
  label: string;
  level: 'elementary' | 'middle' | 'high';
}
