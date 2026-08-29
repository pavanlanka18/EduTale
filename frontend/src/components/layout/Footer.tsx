import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="EduTale Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Edu<span className="text-[#f59e0b]">Tale</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Turn concepts into stories students understand. Personalized AI storytelling adapted for every age, grade, and interest.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="text-slate-400 hover:text-white transition-colors">Explore Library</Link></li>
              <li><Link to="/create/profile" className="text-slate-400 hover:text-white transition-colors">Create Story</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/progress" className="text-slate-400 hover:text-white transition-colors">Learning Progress</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#personalization" className="text-slate-400 hover:text-white transition-colors">Personalization Engine</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">For Teachers & Schools</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Parents Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">EduTale Mission</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Moving learning from <span className="text-slate-200 font-semibold">"Read → Memorize"</span> to <span className="text-brand-300 font-semibold">"Understand → Experience → Remember"</span>.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-brand-300 font-medium">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>for curious minds</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EduTale AI Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
