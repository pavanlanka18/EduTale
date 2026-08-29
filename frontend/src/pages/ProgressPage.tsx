import React from 'react';
import { Trophy, Award, CheckCircle2, Flame, BookOpen, Star, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { storageService } from '../services/apiService';
import { Story } from '../types';

export const ProgressPage: React.FC = () => {
  const profile = storageService.getSavedProfile();
  const stories = storageService.getStories();

  const badgesList = [
    { title: 'First Story', desc: 'Completed 1 personalized lesson', icon: '🚀', unlocked: true },
    { title: 'Jungle Explorer', desc: 'Mastered Ecosystem Food Chains', icon: '🐯', unlocked: true },
    { title: 'Curious Mind', desc: 'Answered 5 quiz questions', icon: '💡', unlocked: true },
    { title: 'Cosmic Scholar', desc: 'Explored Astrophysics concepts', icon: '🌌', unlocked: true },
    { title: '7-Day Streak', desc: 'Learned continuously for 7 days', icon: '🔥', unlocked: false },
    { title: 'Master Storyteller', desc: 'Created 10 custom lessons', icon: '🪄', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge color="amber" size="md" icon={<Trophy className="w-4 h-4 text-amber-600" />}>
            Learning Analytics
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {profile.name || 'Alex'}'s Learning Journey 🏆
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Track your completed lessons, mastered concepts, and unlocked achievements.
          </p>
        </div>

        {/* METRICS STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center space-y-1 bg-white">
            <span className="text-3xl font-extrabold text-brand-600">{stories.length}</span>
            <p className="text-xs font-bold text-slate-500 uppercase">Stories Created</p>
          </Card>

          <Card className="text-center space-y-1 bg-white">
            <span className="text-3xl font-extrabold text-amber-500">4</span>
            <p className="text-xs font-bold text-slate-500 uppercase">Day Streak 🔥</p>
          </Card>

          <Card className="text-center space-y-1 bg-white">
            <span className="text-3xl font-extrabold text-emerald-600">8</span>
            <p className="text-xs font-bold text-slate-500 uppercase">Concepts Mastered</p>
          </Card>

          <Card className="text-center space-y-1 bg-white">
            <span className="text-3xl font-extrabold text-indigo-600">100%</span>
            <p className="text-xs font-bold text-slate-500 uppercase">Quiz Accuracy</p>
          </Card>
        </div>

        {/* ACHIEVEMENTS BADGES GRID */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Unlocked Badges</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badgesList.map((badge, idx) => (
              <Card
                key={idx}
                className={`p-5 flex items-start gap-3.5 transition-all ${
                  badge.unlocked
                    ? 'bg-white border-amber-200/80 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{badge.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
                  {badge.unlocked && (
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-2">
                      Unlocked ✓
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
