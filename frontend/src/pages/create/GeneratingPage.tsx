import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { storageService } from '../../services/apiService';
import { StudentProfile, LearningMaterial, Story } from '../../types';

export const GeneratingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    "Understanding your learning material",
    "Adapting explanation to Grade 5 level",
    "Weaving in your interest in Animals & Space",
    "Structuring per-scene narration scripts",
    "Generating per-scene visual artwork & video prompts",
    "Finalizing story lesson layout"
  ];

  useEffect(() => {
    const profile: StudentProfile = storageService.getSavedProfile();
    let material: LearningMaterial = {
      type: 'text',
      name: 'Lesson Input',
      extractedTopic: 'Ecosystem Food Chains'
    };

    try {
      const stored = sessionStorage.getItem('edutale_current_material');
      if (stored) material = JSON.parse(stored);
    } catch {
      // fallback
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    // Generate custom story in background
    storageService.generateCustomStory(profile, material).then((generatedStory: Story) => {
      setTimeout(() => {
        clearInterval(interval);
        navigate(`/create/preview/${generatedStory.id}`);
      }, 1500);
    });

    return () => clearInterval(interval);
  }, [navigate]);

  const progressPercent = Math.min(100, Math.round(((currentStage + 1) / stages.length) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing particles & ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-coral-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        
        {/* CINEMATIC ANIMATED WAND */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-gradient rounded-3xl blur-xl opacity-70 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-slate-900 border border-brand-500/50 flex items-center justify-center shadow-glow">
            <Wand2 className="w-10 h-10 text-brand-300 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Creating your personalized story... ✨
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            EduTale AI is combining your learning material with learner preferences.
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>AI Story Engine</span>
            <span className="text-brand-300 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-brand-gradient rounded-full transition-all duration-700 ease-out shadow-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STAGES LIST */}
        <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 text-left space-y-3.5 backdrop-blur-md">
          {stages.map((stageText, idx) => {
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-brand-300 scale-[1.01]'
                    : 'text-slate-600 opacity-60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex-shrink-0" />
                )}
                <span>{stageText}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
