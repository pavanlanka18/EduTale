import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  Wand2,
  Tv,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studentA' | 'studentB'>('studentA');

  return (
    <div className="min-h-screen bg-surface-bg overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-20 md:pt-16 md:pb-28 bg-hero-gradient">
        {/* Background decorative glowing circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-coral-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge color="brand" size="md" icon={<Sparkles className="w-4 h-4 text-brand-600" />}>
              AI-Powered Personalized Visual Lessons
            </Badge>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Your lessons. Your interests.{' '}
              <span className="text-transparent bg-clip-text bg-brand-gradient">
                Your story.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
              EduTale transforms textbook chapters, notes, and PDFs into captivating visual stories personalized specifically to your age, grade, and unique interests.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create/profile" className="w-full sm:w-auto">
                <Button size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
                  Create My Story →
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" fullWidth icon={<Play className="w-4 h-4 fill-brand-600 text-brand-600" />}>
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Grade 1 to 12 Adaptable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Text, PDF & Photo OCR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Narrated Video Scenes</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE HERO VISUAL DEMO */}
          <div className="mt-12 max-w-5xl mx-auto relative">
            {/* Floating Tags */}
            <div className="hidden lg:flex absolute -top-6 -left-6 z-20 animate-float">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-200 shadow-float flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
                <span className="font-bold text-slate-800 text-xs">10 Years Old</span>
              </div>
            </div>

            <div className="hidden lg:flex absolute -top-8 right-12 z-20 animate-float-delayed">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-coral-200 shadow-float flex items-center gap-2">
                <span className="text-base">🐯</span>
                <span className="font-bold text-slate-800 text-xs">Animals & Jungle</span>
              </div>
            </div>

            <div className="hidden lg:flex absolute -bottom-6 left-12 z-20 animate-float-delayed">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-200 shadow-float flex items-center gap-2">
                <span className="font-extrabold text-amber-600 text-xs">Grade 5</span>
              </div>
            </div>

            {/* Transformation Board */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 1. INPUT TEXTBOOK */}
                <div className="md:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Material</span>
                    <Badge color="slate" size="sm" icon={<FileText className="w-3 h-3" />}>PDF Chapter</Badge>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <p className="text-xs font-bold text-slate-800">Chapter 4: Ecosystems & Food Chains</p>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      "Energy flows through an ecosystem as organisms consume one another. Producers fix radiant solar energy into chemical sugars..."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-md">Food Web</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">Photosynthesis</span>
                  </div>
                </div>

                {/* 2. AI TRANSFORMATION ENGINE */}
                <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow animate-pulse-glow">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-extrabold text-brand-700 block">AI Story Engine</span>
                    <span className="text-[9px] text-slate-400 font-medium">Personalizing...</span>
                  </div>
                </div>

                {/* 3. GENERATED STORY CARD */}
                <div className="md:col-span-6 bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-coral-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Visual Lesson Ready
                      </span>
                      <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold">4 Scenes • 3 mins</span>
                    </div>

                    <h3 className="text-lg font-bold text-white">Milo's Jungle Food Chain Adventure</h3>
                    
                    <p className="text-xs text-purple-200 line-clamp-2">
                      Join Milo the curious zebra as he discovers how sun rays give grass energy, feeding primary consumers in the Amazon!
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Narration + Video</span>
                      </div>
                      <Link to="/story/story-food-chain-milo">
                        <Button size="sm" variant="gradient" icon={<Play className="w-3.5 h-3.5 fill-white" />}>
                          Watch Story
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge color="coral" size="md">Simple 4-Step Process</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How EduTale creates your story
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Transforming complex school concepts into engaging visual lessons takes just four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-surface-bg rounded-3xl p-6 border border-purple-100 hover:shadow-float transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tell us about the learner</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select age, grade level, and hobbies like animals, space, gaming, or sports so the story connects personally.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-bg rounded-3xl p-6 border border-purple-100 hover:shadow-float transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-coral-100 text-coral-600 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Add what you're learning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag and drop your textbook PDF, upload a note photo, or paste plain text directly into our editor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-bg rounded-3xl p-6 border border-purple-100 hover:shadow-float transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">EduTale creates the story</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our AI RAG pipeline extracts facts and drafts age-appropriate scene scripts, prompts, and audio narration.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-surface-bg rounded-3xl p-6 border border-purple-100 hover:shadow-float transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-2xl bg-mint-100 text-mint-800 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Learn through visual scenes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Watch animated scene clips, listen to clear narration, read captions, and lock in concepts with quick quizzes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONALIZATION SIDE-BY-SIDE SECTION */}
      <section id="personalization" className="py-20 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge color="brand" size="md" icon={<Zap className="w-4 h-4" />}>
              The Key Differentiator
            </Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One concept. A different story for every learner.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              The exact same academic topic adaptively transforms based on who is learning. Switch students below to compare!
            </p>

            {/* Tab Toggle */}
            <div className="mt-8 inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-2">
              <button
                onClick={() => setActiveTab('studentA')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'studentA'
                    ? 'bg-white text-brand-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🐯 Student A (Age 10 • Grade 5)
              </button>
              <button
                onClick={() => setActiveTab('studentB')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'studentB'
                    ? 'bg-white text-brand-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚀 Student B (Age 14 • Grade 9)
              </button>
            </div>
          </div>

          {/* Interactive Comparison Card */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'studentA' ? (
              <div className="bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-xl transition-all duration-300 animate-in fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Learner Profile</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Alex • 10 Years Old</h3>
                    <p className="text-sm text-slate-500 font-medium">Grade 5 • Loves Animals & Jungle Adventures</p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5">
                    <span>Topic:</span>
                    <span className="underline">Ecosystem Food Chains</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-base">Story Approach:</h4>
                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 space-y-2">
                      <p className="font-bold text-brand-900 text-sm">"Milo's Jungle Food Chain Adventure"</p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Explained through Milo the zebra, green grass producers, and gentle jungle storytelling focusing on basic food transfer.
                      </p>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Simple vocabulary: Producers, Herbivores, Predators</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Playful colorful animal artwork</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Short 10-second narrated scenes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <img
                      src="https://images.unsplash.com/photo-1526095179574-86e5458421e0?auto=format&fit=crop&w=800&q=80"
                      alt="Jungle Zebra"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4 bg-slate-900 text-white">
                      <p className="text-xs italic text-slate-300">
                        "Milo gets his energy by munching on lush green grass! Because he eats plants directly, scientists call him a Primary Consumer!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-indigo-500/40 shadow-2xl transition-all duration-300 animate-in fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Learner Profile</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">Jordan • 14 Years Old</h3>
                    <p className="text-sm text-slate-400 font-medium">Grade 9 • Loves Space & Astrophysics</p>
                  </div>
                  <div className="bg-indigo-900/80 text-indigo-200 font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 border border-indigo-700">
                    <span>Topic:</span>
                    <span className="underline">Ecosystem Food Chains</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-white text-base">Story Approach:</h4>
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
                      <p className="font-bold text-indigo-300 text-sm">"The Cosmic Ecosystem: Galactic Energy Transfers"</p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Framed inside an orbital space dome biosystem using thermodynamic energy conservation principles and mathematical trophic ratios.
                      </p>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>Advanced terms: Thermodynamic entropy, Trophic loss ratio</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>Futuristic holographic sci-fi visual style</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>Quantitative ecosystem breakdown</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-sm relative group">
                    <img
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                      alt="Space Habitat"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4 bg-slate-950 text-slate-200">
                      <p className="text-xs italic text-slate-300">
                        "At each ascending trophic level, 90% of heat radiates into space according to thermodynamic entropy, leaving 10% for biomass growth."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM BANNER */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient rounded-3xl p-8 sm:p-12 text-white text-center shadow-glow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to transform how you learn?
              </h2>
              <p className="text-purple-100 text-base sm:text-lg">
                Join thousands of students and parents making learning fun, visual, and unforgettable.
              </p>
              <div>
                <Link to="/create/profile">
                  <Button size="lg" className="bg-white text-brand-900 hover:bg-slate-100 shadow-xl">
                    Create My First Story Now →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
