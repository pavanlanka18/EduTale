import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Subtitles,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { storageService } from '../services/apiService';
import { Story, Scene } from '../types';

export const LearnPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const story: Story | undefined = storageService.getStoryById(id || 'story-food-chain-milo');

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const activeScene: Scene | undefined = story?.scenes[currentSceneIndex];

  // Web Speech Synthesis for Narration Voiceover
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakNarration = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (activeScene && isPlaying) {
      speakNarration(activeScene.narration);
    } else if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, [currentSceneIndex, isPlaying, isMuted]);

  // Cancel speech synthesis when unmounting component or navigating away
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeScene) {
      const step = 100 / (activeScene.duration * 10);
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            handleNextScene();
            return 0;
          }
          return prev + step;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, activeScene]);

  if (!story || !activeScene) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold">Story Lesson Not Found</h2>
        <Link to="/explore" className="mt-4">
          <Button variant="outline">Browse Explore Library</Button>
        </Link>
      </div>
    );
  }

  const handleNextScene = () => {
    setPlaybackProgress(0);
    if (currentSceneIndex < story.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      if (synthRef.current) synthRef.current.cancel();
      navigate(`/completion/${story.id}`);
    }
  };

  const handlePrevScene = () => {
    setPlaybackProgress(0);
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none overflow-x-hidden">
      
      {/* TOP LESSON HEADER */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link to={`/story/${story.id}`}>
            <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white line-clamp-1">{story.title}</h1>
            <p className="text-xs text-slate-400">Scene {currentSceneIndex + 1} of {story.scenes.length}: {activeScene.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge color="brand" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            {story.gradeLevel}
          </Badge>
        </div>
      </header>

      {/* MAIN VISUAL SCENE AREA */}
      <main className="max-w-5xl w-full mx-auto my-6 flex-1 flex flex-col items-center justify-center">
        
        <div className="relative w-full aspect-video max-h-[60vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
          
          {/* SCENE VISUAL ARTWORK */}
          <img
            src={activeScene.imageUrl}
            alt={activeScene.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

          {/* TOP HIGHLIGHTED CONCEPTS FLOATING TAGS */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {activeScene.conceptsHighlighted.map((concept, idx) => (
              <span key={idx} className="bg-brand-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-brand-400/30 shadow-md">
                ✨ {concept}
              </span>
            ))}
          </div>

          {/* OVERLAY CAPTIONS */}
          {showCaptions && (
            <div className="absolute bottom-6 left-6 right-6 z-10 text-center">
              <div className="inline-block bg-black/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 text-white font-medium text-sm sm:text-base leading-relaxed max-w-2xl shadow-xl">
                "{activeScene.narration}"
              </div>
            </div>
          )}

          {/* CENTER PLAY OVERLAY WHEN PAUSED */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute z-20 w-16 h-16 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-glow hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

        </div>

      </main>

      {/* BOTTOM CONTROL DECK */}
      <footer className="max-w-5xl w-full mx-auto space-y-4">
        
        {/* SCENE TIMELINE PROGRESS BARS */}
        <div className="grid grid-cols-4 gap-2">
          {story.scenes.map((s, idx) => {
            const isCompleted = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;

            return (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setPlaybackProgress(0);
                }}
                className="cursor-pointer group py-1"
              >
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isCompleted
                        ? 'bg-brand-500'
                        : isCurrent
                        ? 'bg-brand-gradient'
                        : 'bg-transparent'
                    }`}
                    style={{
                      width: isCurrent ? `${playbackProgress}%` : isCompleted ? '100%' : '0%',
                    }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block truncate group-hover:text-slate-300">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* MEDIA BUTTON BAR */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 backdrop-blur-md">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showCaptions ? 'bg-brand-500/20 text-brand-300 border-brand-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Subtitles className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN PLAYER CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevScene}
              disabled={currentSceneIndex === 0}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleNextScene}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div>
            <Button
              size="sm"
              onClick={handleNextScene}
              className="bg-brand-600 text-white"
            >
              {currentSceneIndex === story.scenes.length - 1 ? 'Finish Lesson 🎉' : 'Next Scene →'}
            </Button>
          </div>

        </div>

      </footer>

    </div>
  );
};
