import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-brand-gradient -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-100'
                    : isCurrent
                    ? 'bg-brand-gradient text-white ring-4 ring-brand-200 scale-110 shadow-glow'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-semibold tracking-wide transition-colors ${
                  isCurrent
                    ? 'text-brand-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
