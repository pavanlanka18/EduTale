import React from 'react';
import { InterestOption } from '../../types';
import { Check } from 'lucide-react';

interface InterestCardProps {
  option: InterestOption;
  selected: boolean;
  onToggle: (id: string) => void;
}

export const InterestCard: React.FC<InterestCardProps> = ({ option, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(option.id)}
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-h-[52px] select-none ${
        selected
          ? 'border-brand-500 bg-brand-50 shadow-sm ring-2 ring-brand-400/30'
          : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/80 shadow-2xs'
      }`}
    >
      <span className="text-2xl transition-transform group-hover:scale-110 duration-200">
        {option.emoji}
      </span>
      <span className="font-semibold text-slate-800 text-sm flex-1">{option.label}</span>
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          selected ? 'bg-brand-600 text-white scale-100' : 'border border-slate-300 bg-white group-hover:border-brand-400'
        }`}
      >
        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
};
