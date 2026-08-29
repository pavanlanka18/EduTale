import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { StudentProfilePage } from './pages/create/StudentProfilePage';
import { LearningMaterialPage } from './pages/create/LearningMaterialPage';
import { GeneratingPage } from './pages/create/GeneratingPage';
import { StoryPreviewPage } from './pages/create/StoryPreviewPage';
import { LearnPlayerPage } from './pages/LearnPlayerPage';
import { LessonCompletionPage } from './pages/LessonCompletionPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProgressPage } from './pages/ProgressPage';

export default function App() {
  const location = useLocation();

  // Hide Navbar and Footer in distraction-free Lesson Player
  const isPlayerRoute = location.pathname.startsWith('/learn/');

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-slate-900 font-sans">
      {!isPlayerRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* CREATE STORY WIZARD ROUTES */}
          <Route path="/create/profile" element={<StudentProfilePage />} />
          <Route path="/create/material" element={<LearningMaterialPage />} />
          <Route path="/create/generating" element={<GeneratingPage />} />
          <Route path="/create/preview/:id" element={<StoryPreviewPage />} />
          <Route path="/story/:id" element={<StoryPreviewPage />} />

          {/* LESSON PLAYER & COMPLETION */}
          <Route path="/learn/:id" element={<LearnPlayerPage />} />
          <Route path="/completion/:id" element={<LessonCompletionPage />} />

          {/* DASHBOARD & EXPLORE */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>

      {!isPlayerRoute && <Footer />}
    </div>
  );
}
