import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface StepTopicProps {
  initialTopic: string;
  filename: string | null;
  error: string | null;
  onBack: () => void;
  onNext: (topic: string) => void;
}

export const StepTopic: React.FC<StepTopicProps> = ({
  initialTopic,
  filename,
  error,
  onBack,
  onNext,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setLocalError("Please enter a topic from your material (e.g. food chain, photosynthesis).");
      return;
    }
    setLocalError(null);
    onNext(topic.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Step 2: Educational Topic 🎯</h2>
        <p className="text-sm text-slate-600">
          What specific topic should EduTale AI retrieve from {filename || "your document"}?
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-800">
          Educational Topic Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setLocalError(null); }}
            placeholder="e.g. food chain, photosynthesis, gravity, ecosystem balance"
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 font-semibold text-sm"
          />
          <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {(localError || error) && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {localError || error}
        </div>
      )}

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={!topic.trim()}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Next: Student Profile →
        </Button>
      </div>
    </form>
  );
};
