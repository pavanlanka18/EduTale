import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Sparkles, BookOpen, Play, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { storageService, INTEREST_OPTIONS } from '../services/apiService';
import { Story } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');

  const stories: Story[] = storageService.getStories();

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.conceptName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInterest = selectedInterest === 'all' || s.learnerProfile.interests.includes(selectedInterest);
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge color="brand" size="md" icon={<Compass className="w-4 h-4 text-brand-600" />}>
            Story Library
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore Visual Lessons 🌍
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Discover pre-generated educational stories across science, history, and math.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-purple-100 shadow-md space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, topics, or titles (e.g. Food Chain, Thermodynamics)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 text-sm font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedInterest('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                selectedInterest === 'all'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ✨ All Topics
            </button>
            {INTEREST_OPTIONS.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelectedInterest(i.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedInterest === i.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{i.emoji}</span>
                <span>{i.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} hoverable className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-48 relative">
                  <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge color="coral" size="sm">{story.gradeLevel}</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    {story.conceptName}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{story.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{story.subtitle}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="text-xs text-slate-500 font-semibold">{story.scenes.length} Visual Scenes</span>
                <Link to={`/story/${story.id}`}>
                  <Button size="sm" icon={<Play className="w-3.5 h-3.5 fill-white" />}>
                    Watch Story
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};
