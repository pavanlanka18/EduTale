import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, HelpCircle, ArrowRight, RotateCcw, CheckCircle2, Star, ThumbsUp, HeartHandshake, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { storageService } from '../services/apiService';
import { Story } from '../types';

export const LessonCompletionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const story: Story | undefined = storageService.getStoryById(id || 'story-food-chain-milo');

  const [understandingRating, setUnderstandingRating] = useState<'not_understood' | 'getting_there' | 'got_it' | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti on page load
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  }, []);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/explore"><Button>Browse Stories</Button></Link>
      </div>
    );
  }

  const handleRatingSelect = (rating: 'not_understood' | 'getting_there' | 'got_it') => {
    setUnderstandingRating(rating);
    story.userRating = rating;
    storageService.saveStory(story);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
  };

  const handleNextQuizQuestion = () => {
    if (selectedOption === story.quiz[quizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }

    if (quizIndex < story.quiz.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        
        {/* CELEBRATORY HERO BANNER */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-xl space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center mx-auto shadow-glow animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <Badge color="mint" size="md">Lesson Completed! 🎉</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              You just learned something new!
            </h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base max-w-lg mx-auto">
              Great job completing <span className="font-bold text-brand-700">{story.title}</span>.
            </p>
          </div>

          {/* CONCEPT CARDS RECAP */}
          <div className="pt-4 border-t border-slate-100 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              What you mastered today
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {story.concepts.map((concept, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <span className="text-2xl">{concept.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{concept.name}</h4>
                    <p className="text-xs text-slate-500">{concept.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONFIDENCE INTERACTION */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h4 className="text-sm font-bold text-slate-800">
              How well do you understand this concept?
            </h4>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleRatingSelect('not_understood')}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  understandingRating === 'not_understood'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                <Smile className="w-4 h-4 rotate-180" />
                <span>Not understood yet</span>
              </button>

              <button
                onClick={() => handleRatingSelect('getting_there')}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  understandingRating === 'getting_there'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Getting there</span>
              </button>

              <button
                onClick={() => handleRatingSelect('got_it')}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  understandingRating === 'got_it'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I got it! 🎯</span>
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            {story.quiz.length > 0 && (
              <Button
                size="lg"
                onClick={() => setIsQuizModalOpen(true)}
                icon={<HelpCircle className="w-5 h-5" />}
              >
                Take Quick Quiz →
              </Button>
            )}

            <Link to="/create/material">
              <Button size="lg" variant="outline" icon={<Sparkles className="w-5 h-5" />}>
                Create Another Story
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button size="lg" variant="ghost">
                Go to Dashboard
              </Button>
            </Link>
          </div>

        </div>

      </div>

      {/* QUIZ MODAL */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title={`Knowledge Check: ${story.title}`}
      >
        {!quizSubmitted ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Question {quizIndex + 1} of {story.quiz.length}</span>
              <span className="text-brand-600">EduTale Quiz</span>
            </div>

            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {story.quiz[quizIndex].question}
            </h4>

            <div className="space-y-2.5">
              {story.quiz[quizIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    selectedOption === idx
                      ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="md"
                disabled={selectedOption === null}
                onClick={handleNextQuizQuestion}
              >
                {quizIndex < story.quiz.length - 1 ? 'Next Question →' : 'Submit Quiz 🎉'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quiz Complete!</h3>
            <p className="text-slate-600 text-sm">
              You scored <span className="font-extrabold text-brand-700">{quizScore} / {story.quiz.length}</span> correct!
            </p>
            <div className="pt-2">
              <Button size="md" onClick={() => setIsQuizModalOpen(false)}>
                Back to Completion Screen
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
