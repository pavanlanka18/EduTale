import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Compass, Trophy, Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { authService, User as UserType } from '../../services/authService';
import { AuthModal } from '../AuthModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => authService.getUser());
  const location = useLocation();

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: <Compass className="w-4 h-4" /> },
    { label: 'My Stories', path: '/dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Progress', path: '/progress', icon: <Trophy className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-purple-100/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.svg" alt="EduTale Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#0c1142] leading-none">
                Edu<span className="text-[#f59e0b]">Tale</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                Personalized Stories
              </span>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive('/') ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              How it Works
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link to="/create/profile" className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-slate-700 hover:text-brand-700 hover:bg-brand-50 text-sm font-semibold transition-all border border-slate-200/80">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Profile Settings ({currentUser.full_name || currentUser.email.split('@')[0]})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-purple-100 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 animate-in slide-down">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              How it Works
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {currentUser ? (
                <>
                  <Link
                    to="/create/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <User className="w-4 h-4 text-indigo-600" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-2xl font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out ({currentUser.email})
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-2xl font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Log In / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
};
