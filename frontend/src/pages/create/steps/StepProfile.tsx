import React, { useState } from 'react';
import { ArrowLeft, Sparkles, User, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { InterestCard } from '../../../components/ui/InterestCard';
import { INTEREST_OPTIONS, GRADE_OPTIONS } from '../../../services/apiService';

interface StepProfileProps {
  initialAge: number;
  initialGrade: number;
  initialInterest: string;
  isGenerating: boolean;
  error: string | null;
  onBack: () => void;
  onGenerate: (profile: { age: number; grade: number; interest: string }) => void;
}

export const StepProfile: React.FC<StepProfileProps> = ({
  initialAge,
  initialGrade,
  initialInterest,
  isGenerating,
  error,
  onBack,
  onGenerate,
}) => {
  const [age, setAge] = useState<number>(initialAge);
  const [grade, setGrade] = useState<number>(initialGrade);
  const [interest, setInterest] = useState<string>(initialInterest);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ age, grade, interest });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Step 3: Student Profile 🧑‍🎓</h2>
        <p className="text-sm text-slate-600">Tailor the story level and creative theme for the learner.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-slate-800">Learner's Age</label>
            <span className="text-xs font-bold bg-brand-100 text-brand-800 px-3 py-1 rounded-full">{age} Yrs</span>
          </div>
          <input
            type="range"
            min="5"
            max="18"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">School Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm outline-none focus:border-brand-500"
          >
            {GRADE_OPTIONS.map((g, idx) => (
              <option key={g.id} value={idx + 1}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">Learner's Passion / Interest Theme</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {INTEREST_OPTIONS.map((option) => (
            <InterestCard
              key={option.id}
              option={option}
              selected={interest === option.id}
              onToggle={() => setInterest(option.id)}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          disabled={isGenerating}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={isGenerating}
          icon={isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        >
          {isGenerating ? "Generating Story with RAG..." : "Generate Story ✨"}
        </Button>
      </div>
    </form>
  );
};
