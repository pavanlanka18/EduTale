import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { InterestCard } from '../../components/ui/InterestCard';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { INTEREST_OPTIONS, GRADE_OPTIONS, storageService } from '../../services/apiService';
import { authService } from '../../services/authService';
import { StudentProfile } from '../../types';

export const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const initialProfile = storageService.getSavedProfile();
  const currentUser = authService.getUser();

  const [name, setName] = useState(
    currentUser?.full_name || initialProfile.name || currentUser?.email?.split('@')[0] || ''
  );
  const [age, setAge] = useState<number>(initialProfile.age || 10);
  const [grade, setGrade] = useState<string>(initialProfile.grade || 'Grade 5');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialProfile.interests || ['animals', 'space']
  );

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: StudentProfile = {
      name,
      age,
      grade,
      interests: selectedInterests.length > 0 ? selectedInterests : ['animals'],
    };
    storageService.saveProfile(updatedProfile);
    navigate('/dashboard');
  };

  const handleDiscard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Customize Student Profile ✨
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Update student details and learning preferences saved in your account.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-xl space-y-8">
          
          {/* NAME & AGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Learner's First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Learner Name"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 font-semibold text-sm"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-800">
                  Learner's Age
                </label>
                <span className="text-xs font-bold bg-brand-100 text-brand-800 px-3 py-1 rounded-full">
                  {age} Years Old
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="18"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
                <span>5 yrs</span>
                <span>12 yrs</span>
                <span>18 yrs</span>
              </div>
            </div>
          </div>

          {/* GRADE SELECTOR */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              School Grade / Class
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {GRADE_OPTIONS.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGrade(g.id)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                    grade === g.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* INTERESTS */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-slate-800">
                Learner's Passions & Hobbies
              </label>
              <span className="text-xs text-slate-500 font-medium">Select 1 or more</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {INTEREST_OPTIONS.map((option) => (
                <InterestCard
                  key={option.id}
                  option={option}
                  selected={selectedInterests.includes(option.id)}
                  onToggle={toggleInterest}
                />
              ))}
            </div>
          </div>

          {/* SUBMIT & DISCARD BUTTONS */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscard}
            >
              Discard Changes
            </Button>
            <Button size="lg" type="submit">
              Save Profile
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
