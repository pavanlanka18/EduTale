import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, Type, Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { Badge } from '../../components/ui/Badge';
import { LearningMaterial } from '../../types';

export const LearningMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'text'>('pdf');
  const [pastedText, setPastedText] = useState(
    'Ecosystems rely on food chains to transfer energy between organisms. Producers like plants absorb solar light through photosynthesis. Primary consumers like herbivore zebras eat plants, and carnivore predators consume herbivores.'
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<LearningMaterial | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedData({
        type: activeTab,
        name: file.name,
        extractedTopic: "Food Chains & Energy Flow",
        extractedConcepts: ["Producers & Solar Energy", "Primary Consumers", "Apex Predators", "Nutrient Loops"],
        fileSize: `${(file.size / 1024).toFixed(1)} KB`
      });
    }, 1500);
  };

  const handleTextSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedData({
        type: 'text',
        name: 'Pasted Notes',
        content: pastedText,
        extractedTopic: 'Ecosystem Food Chains',
        extractedConcepts: ['Photosynthesis', 'Primary Consumers', 'Secondary Carnivores', 'Ecosystem Balance']
      });
    }, 1200);
  };

  const handleProceed = () => {
    const materialData: LearningMaterial = extractedData || {
      type: 'text',
      name: 'Lesson Input',
      content: pastedText,
      extractedTopic: 'Ecosystem Food Chains',
      extractedConcepts: ['Producers', 'Consumers', 'Energy Flow']
    };
    sessionStorage.setItem('edutale_current_material', JSON.stringify(materialData));
    navigate('/create/generating');
  };

  const steps = [
    { id: 1, label: 'Profile' },
    { id: 2, label: 'Material' },
    { id: 3, label: 'Story AI' },
    { id: 4, label: 'Learn' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProgressStepper steps={steps} currentStep={2} />

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            What are we learning today? 📚
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Upload your textbook PDF, a photo of your notes, or paste direct text below.
          </p>
        </div>

        {/* INPUT TABS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('pdf'); setExtractedData(null); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'pdf' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('image'); setExtractedData(null); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'image' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Photo (OCR)</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('text'); setExtractedData(null); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'text' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Paste Text</span>
            </button>
          </div>

          {/* TAB 1 & 2: FILE UPLOAD ZONE */}
          {(activeTab === 'pdf' || activeTab === 'image') && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-brand-200 hover:border-brand-500 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-brand-50/30 transition-all cursor-pointer relative group"
            >
              <input
                type="file"
                accept={activeTab === 'pdf' ? '.pdf' : 'image/*'}
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Drop your {activeTab === 'pdf' ? 'PDF textbook chapter' : 'textbook photo'} here
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'pdf' ? 'Supports PDF documents up to 25MB' : 'Supports JPG, PNG, WEBP with OCR extraction'}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                  Browse Files
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT EDITOR */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-800">
                Paste your study notes or concept material:
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste paragraph, notes, or chapter excerpt here..."
                className="w-full p-4 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 text-sm leading-relaxed"
              />
              <div className="flex justify-end">
                <Button size="md" variant="secondary" onClick={handleTextSubmit}>
                  Analyze Text Content
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING ANIMATION STATE */}
          {isProcessing && (
            <div className="bg-brand-50 rounded-2xl p-6 border border-brand-200 flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="font-bold text-brand-900 text-sm">Extracting educational concepts...</p>
                <p className="text-xs text-brand-700">Analyzing key topics and terminology for personalized RAG</p>
              </div>
            </div>
          )}

          {/* EXTRACTED RESULT BANNER */}
          {extractedData && !isProcessing && (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>We found your lesson!</span>
                </div>
                <Badge color="mint" size="sm">{extractedData.name}</Badge>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Extracted Educational Topic:</p>
                <h4 className="text-lg font-extrabold text-slate-900">{extractedData.extractedTopic}</h4>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-2">Key Concepts Identified:</p>
                <div className="flex flex-wrap gap-2">
                  {extractedData.extractedConcepts?.map((concept, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-xl text-xs font-semibold text-slate-700 border border-emerald-200 shadow-2xs">
                      ✨ {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/create/profile')}
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
            >
              Back
            </Button>

            <Button
              size="lg"
              onClick={handleProceed}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Looks Good → Create Story
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
