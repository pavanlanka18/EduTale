import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, Type, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { Badge } from '../../components/ui/Badge';
import { LearningMaterial } from '../../types';
import { storageService } from '../../services/apiService';

export const LearningMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pdf' | 'image' | 'text'>('text');
  const [pastedText, setPastedText] = useState(
    'Ecosystems rely on food chains to transfer energy between organisms. Producers like plants absorb solar light through photosynthesis. Primary consumers like herbivore zebras eat plants, and carnivore predators consume herbivores.'
  );
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

  const processFile = async (file: File) => {
    setIsProcessing(true);
    const extracted = await storageService.uploadFileAndExtract(file);
    setIsProcessing(false);
    setExtractedData(extracted);
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
        extractedConcepts: ['Photosynthesis', 'Primary Consumers', 'Secondary Carnivores']
      });
    }, 800);
  };

  const handleNextStep = () => {
    const materialData: LearningMaterial = extractedData || {
      type: 'text',
      name: 'Study Material',
      content: pastedText,
      extractedTopic: 'Ecosystem Food Chains',
      extractedConcepts: ['Producers', 'Consumers', 'Energy Flow']
    };
    sessionStorage.setItem('edutale_current_material', JSON.stringify(materialData));
    navigate('/create/material');
  };

  const steps = [
    { id: 1, label: '1. Notes & Docs' },
    { id: 2, label: '2. Topic & Profile' },
    { id: 3, label: '3. Story AI' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProgressStepper steps={steps} currentStep={1} />

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Step 1: Upload Notes or Document 📄
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Upload your textbook PDF, a photo of your classroom notes, or paste your lesson content below.
          </p>
        </div>

        {/* INPUT TABS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('text'); setExtractedData(null); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'text' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Paste Notes</span>
            </button>

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
              <span>Photo / OCR</span>
            </button>
          </div>

          {/* TAB 1: TEXT EDITOR */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-800">
                Paste study notes, textbook paragraphs, or key concepts:
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste paragraph, notes, or chapter excerpt here..."
                className="w-full p-4 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 text-sm leading-relaxed"
              />
            </div>
          )}

          {/* TAB 2 & 3: FILE UPLOAD ZONE */}
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
                Drop your {activeTab === 'pdf' ? 'PDF document' : 'photo/image'} here
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'pdf' ? 'Supports PDF textbook chapters' : 'OCR extracts text automatically from images'}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                  Browse Files
                </span>
              </div>
            </div>
          )}

          {/* PROCESSING ANIMATION */}
          {isProcessing && (
            <div className="bg-brand-50 rounded-2xl p-5 border border-brand-200 flex items-center gap-4 animate-pulse">
              <div className="w-7 h-7 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="font-bold text-brand-900 text-sm">Processing learning document...</p>
                <p className="text-xs text-brand-700">Chunking & extracting key material for RAG vector retrieval</p>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
            >
              Cancel
            </Button>

            <Button
              size="lg"
              onClick={handleNextStep}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Next: Topic & Profile →
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
