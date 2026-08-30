import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { StepSourceMaterial } from './steps/StepSourceMaterial';
import { StepTopic } from './steps/StepTopic';
import { StepProfile } from './steps/StepProfile';
import { storageService } from '../../services/apiService';


export const CreateStoryWizard: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Flow State
  const [step, setStep] = useState<number>(1);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>(
    'Ecosystems rely on food chains to transfer energy between organisms. Producers like plants absorb solar light through photosynthesis. Primary consumers like herbivore zebras eat plants, and carnivore predators consume herbivores.'
  );
  const [topic, setTopic] = useState<string>('food chain');
  const [age, setAge] = useState<number>(10);
  const [grade, setGrade] = useState<number>(5);
  const [interest, setInterest] = useState<string>('space');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: '1. Source Material' },
    { id: 2, label: '2. Educational Topic' },
    { id: 3, label: '3. Student Profile' },
  ];

  const handleUploadFile = async (file: File) => {
    return await storageService.uploadDocumentFile(file);
  };

  const handleUploadText = async (text: string) => {
    return await storageService.uploadDocumentText(text);
  };

  const handleSourceNext = (docId: string, name: string, textContent: string) => {
    setDocumentId(docId);
    setFilename(name);
    if (textContent) setPastedText(textContent);
    setError(null);
    setStep(2);
  };

  const handleTopicNext = (enteredTopic: string) => {
    setTopic(enteredTopic);
    setError(null);
    setStep(3);
  };

  const handleGenerateStory = async (profileData: { age: number; grade: number; interest: string }) => {
    setIsGenerating(true);
    setError(null);

    setAge(profileData.age);
    setGrade(profileData.grade);
    setInterest(profileData.interest);

    try {
      const generatedStory = await storageService.generateStoryWithRAG({
        document_id: documentId,
        topic: topic,
        profile: {
          age: profileData.age,
          grade: profileData.grade,
          interest: profileData.interest,
        },
      });

      setIsGenerating(false);
      navigate(`/create/preview/${generatedStory.id}`);
    } catch (err: any) {
      setIsGenerating(false);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to generate story.";
      
      // If 422 topic not found error, redirect user back to Step 2 with clear error message
      if (err.response?.status === 422 || errorMsg.includes("not found")) {
        setError(errorMsg);
        setStep(2);
      } else {
        setError(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* STEP PROGRESS INDICATOR */}
        <div className="space-y-2">
          <ProgressStepper steps={steps} currentStep={step} />
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step {step} of 3
          </p>
        </div>

        {/* STEP 1: SOURCE MATERIAL */}
        {step === 1 && (
          <StepSourceMaterial
            initialText={pastedText}
            onNext={handleSourceNext}
            onUploadFile={handleUploadFile}
            onUploadText={handleUploadText}
          />
        )}

        {/* STEP 2: TOPIC */}
        {step === 2 && (
          <StepTopic
            initialTopic={topic}
            filename={filename}
            error={error}
            onBack={() => setStep(1)}
            onNext={handleTopicNext}
          />
        )}

        {/* STEP 3: STUDENT PROFILE */}
        {step === 3 && (
          <StepProfile
            initialAge={age}
            initialGrade={grade}
            initialInterest={interest}
            isGenerating={isGenerating}
            error={error}
            onBack={() => setStep(2)}
            onGenerate={handleGenerateStory}
          />
        )}

      </div>
    </div>
  );
};
