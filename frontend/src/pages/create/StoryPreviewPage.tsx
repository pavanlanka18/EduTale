import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Sparkles, Clock, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { storageService } from '../../services/apiService';

export const StoryPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const story = storageService.getStoryById(id || 'story-food-chain-milo');

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Story Not Found</h2>
          <Link to="/create/profile">
            <Button>Create New Story</Button>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Profile' },
    { id: 2, label: 'Material' },
    { id: 3, label: 'Story AI' },
    { id: 4, label: 'Learn' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProgressStepper steps={steps} currentStep={3} />

        {/* HERO COVER CARD */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-purple-900 shadow-2xl text-white relative">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <Badge color="brand" size="md" icon={<Sparkles className="w-4 h-4 text-brand-300" />}>
                Story Generated
              </Badge>
              <div className="flex items-center gap-3 text-xs font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-coral-400" />
                  {story.scenes.length * 12}s Duration
                </span>
                <span>•</span>
                <span>{story.scenes.length} Scenes</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
                {story.gradeLevel} • Personalized Story
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {story.title}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                {story.subtitle}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-slate-950">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Learning Objective
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800">
                🎯 {story.objective}
              </p>
            </div>

            {/* WHAT YOU WILL LEARN CONCEPTS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Concepts Covered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {story.concepts.map((concept, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                    <span className="text-2xl">{concept.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{concept.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-normal">{concept.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="md"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
                onClick={() => navigate('/create/material')}
                icon={<ArrowLeft className="w-4 h-4" />}
                iconPosition="left"
              >
                Back to Material
              </Button>

              <Link to={`/learn/${story.id}`} className="w-full sm:w-auto">
                <Button size="lg" fullWidth icon={<Play className="w-5 h-5 fill-white" />}>
                  Start Visual Lesson →
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
