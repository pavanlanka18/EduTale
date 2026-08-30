import React, { useState } from 'react';
import { Upload, FileText, Type, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface StepSourceMaterialProps {
  initialText: string;
  onNext: (docId: string, filename: string, textContent: string) => void;
  onUploadFile: (file: File) => Promise<{ document_id: string; filename: string }>;
  onUploadText: (text: string) => Promise<{ document_id: string; filename: string }>;
}

export const StepSourceMaterial: React.FC<StepSourceMaterialProps> = ({
  initialText,
  onNext,
  onUploadFile,
  onUploadText,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [pastedText, setPastedText] = useState(initialText);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<{ document_id: string; filename: string } | null>(null);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsLoading(true);
    try {
      const res = await onUploadFile(selectedFile);
      setUploadedDoc(res);
    } catch (err: any) {
      setError(err.message || "Failed to process document file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = async () => {
    if (!pastedText.trim()) {
      setError("Please paste study notes or text content before proceeding.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await onUploadText(pastedText);
      setUploadedDoc(res);
      onNext(res.document_id, res.filename, pastedText);
    } catch (err: any) {
      setError(err.message || "Failed to upload text content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextWithFile = () => {
    if (uploadedDoc) {
      onNext(uploadedDoc.document_id, uploadedDoc.filename, "");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Step 1: Source Material 📄</h2>
        <p className="text-sm text-slate-600">Provide textbook notes, PDF chapter, or paste text below.</p>
      </div>

      <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2">
        <button
          type="button"
          onClick={() => { setActiveTab('text'); setError(null); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'text' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Paste Notes</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('file'); setError(null); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'file' ? 'bg-white text-brand-700 shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload PDF / Photo</span>
        </button>
      </div>

      {activeTab === 'text' && (
        <div className="space-y-4">
          <textarea
            rows={6}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste textbook notes or chapter content..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-slate-800 text-sm leading-relaxed"
          />
        </div>
      )}

      {activeTab === 'file' && (
        <div className="border-2 border-dashed border-brand-200 hover:border-brand-500 rounded-3xl p-8 text-center bg-slate-50/50 relative">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">
            {file ? file.name : "Click or drag PDF/image file here"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports PDF chapters and OCR photos</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      {uploadedDoc && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Indexed as {uploadedDoc.filename}</span>
        </div>
      )}

      <div className="pt-4 flex justify-end border-t border-slate-100">
        {activeTab === 'text' ? (
          <Button
            size="lg"
            onClick={handleSubmitText}
            disabled={isLoading || !pastedText.trim()}
            icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          >
            {isLoading ? "Indexing Material..." : "Next: Topic →"}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleNextWithFile}
            disabled={isLoading || !uploadedDoc}
            icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          >
            {isLoading ? "Indexing File..." : "Next: Topic →"}
          </Button>
        )}
      </div>
    </div>
  );
};
