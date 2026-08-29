import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Plus, Flame, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { storageService, INTEREST_OPTIONS } from '../services/apiService';
import { authService } from '../services/authService';
import { Story, StudentProfile } from '../types';

export const DashboardPage: React.FC = () => {
  const profile: StudentProfile = storageService.getSavedProfile();
  const currentUser = authService.getUser();
  const stories: Story[] = storageService.getStories();

  const displayName = currentUser?.full_name || profile.name || currentUser?.email?.split('@')[0] || 'Learner';

  const activeStory = stories[0];

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HERO GREETING BANNER */}
        <div className="bg-brand-gradient rounded-3xl p-8 sm:p-10 text-white shadow-glow relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Learning Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Good afternoon, {displayName} 👋
            </h1>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Ready for your next personalized lesson? You have learned <span className="font-extrabold text-white underline">{stories.length} stories</span> adapted to {profile.grade}.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/create/profile">
                <Button size="md" className="bg-white text-brand-900 hover:bg-slate-100" icon={<Plus className="w-4 h-4" />}>
                  Create New Story
                </Button>
              </Link>
              <Link to="/progress">
                <Button size="md" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  View My Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* METRICS & CONTINUE LEARNING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTINUE LEARNING CARD */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                <span>Continue Learning</span>
              </h2>
              <Link to="/explore" className="text-xs font-bold text-brand-600 hover:text-brand-800">
                Browse All →
              </Link>
            </div>

            {activeStory && (
              <Card glass className="p-0 overflow-hidden hover:shadow-float transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 h-48 md:h-auto relative">
                    <img
                      src={activeStory.coverImage}
                      alt={activeStory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge color="coral" size="sm">Resume Lesson</Badge>
                    </div>
                  </div>

                  <div className="md:col-span-7 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase text-brand-600">
                        {activeStory.gradeLevel} • {activeStory.conceptName}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {activeStory.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {activeStory.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 3 mins remaining
                      </span>
                      <Link to={`/learn/${activeStory.id}`}>
                        <Button size="sm" icon={<Play className="w-3.5 h-3.5 fill-white" />}>
                          Continue →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* SIDEBAR: STREAK & INTERESTS */}
          <div className="space-y-6">
            
            {/* STREAK WIDGET */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Flame className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Learning Streak</span>
                  <h3 className="text-2xl font-extrabold text-amber-950">4 Days In A Row! 🔥</h3>
                  <p className="text-xs text-amber-800/80">Keep learning daily to earn new badges!</p>
                </div>
              </div>
            </Card>

            {/* YOUR INTERESTS */}
            <Card>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Active Hobbies</span>
                <Link to="/create/profile" className="text-xs text-brand-600 font-semibold hover:underline">Edit</Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interestId) => {
                  const match = INTEREST_OPTIONS.find(i => i.id === interestId);
                  return (
                    <span
                      key={interestId}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200 flex items-center gap-1.5"
                    >
                      <span>{match?.emoji || '⭐'}</span>
                      <span>{match?.label || interestId}</span>
                    </span>
                  );
                })}
              </div>
            </Card>

          </div>

        </div>

        {/* RECENT STORIES LIBRARY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Stories</h2>
            <Link to="/explore" className="text-xs font-bold text-brand-600 hover:underline">See All Stories</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s) => (
              <Card key={s.id} hoverable className="p-0 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-40 relative">
                    <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <Badge color="slate" size="sm">{s.gradeLevel}</Badge>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{s.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{s.subtitle}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="text-xs text-slate-400 font-medium">{s.scenes.length} Scenes</span>
                  <Link to={`/story/${s.id}`}>
                    <Button size="sm" variant="secondary" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
