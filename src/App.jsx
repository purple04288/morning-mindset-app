import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MusicPlayerSection from './components/MusicPlayerSection';
import QuoteSection from './components/QuoteSection';
import JournalEditor from './components/JournalEditor';
import CalendarView from './components/CalendarView';
import ArchiveSearchView from './components/ArchiveSearchView';
import StatsModal from './components/StatsModal';
import BackupModal from './components/BackupModal';

import { CURATED_MUSIC, CURATED_QUOTES } from './data/curatedContent';
import { 
  loadAllEntries, 
  loadCustomMusic, 
  calculateStats, 
  formatDateKey, 
  formatKoreanDate,
  deleteEntry 
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('today');
  const [currentDateKey, setCurrentDateKey] = useState(formatDateKey(new Date()));
  const [entries, setEntries] = useState({});
  const [customMusicList, setCustomMusicList] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(CURATED_MUSIC[0]);
  
  // Pick today's default quote based on day-of-year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const [quoteIndex, setQuoteIndex] = useState(dayOfYear % CURATED_QUOTES.length);
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('morning_mindset_theme') === 'dark';
  });
  
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('morning_mindset_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('morning_mindset_theme', 'light');
    }
  }, [darkMode]);

  // Load entries and custom music on mount
  const refreshData = () => {
    const loadedEntries = loadAllEntries();
    setEntries(loadedEntries);
    const loadedCustom = loadCustomMusic();
    setCustomMusicList(loadedCustom);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = calculateStats(entries);
  const currentQuote = CURATED_QUOTES[quoteIndex % CURATED_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % CURATED_QUOTES.length);
  };

  const handleInsertQuoteToJournal = (quote) => {
    // If not already in today tab, switch
    if (currentTab !== 'today') {
      setCurrentTab('today');
    }
    // We can dispatch or notify user
    const textToInsert = `[오늘의 인용: “${quote.content}” — ${quote.author}]\n`;
    const existing = entries[currentDateKey];
    const updatedNotes = existing?.notes ? `${existing.notes}\n\n${textToInsert}` : textToInsert;
    
    // Save or let user edit
    alert(`글귀가 오늘(${formatKoreanDate(currentDateKey)}) 다이어리에 인용되었습니다! 저널 작성 영역을 확인하세요.`);
    setEntries(prev => ({
      ...prev,
      [currentDateKey]: {
        ...(prev[currentDateKey] || {}),
        notes: updatedNotes
      }
    }));
  };

  const handleSelectDateToEdit = (dateKey) => {
    setCurrentDateKey(dateKey);
    setCurrentTab('today');
  };

  const handleDeleteEntry = (dateKey) => {
    if (confirm(`${formatKoreanDate(dateKey)}의 기록을 삭제하시겠습니까?`)) {
      deleteEntry(dateKey);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Grid: Inspiring Quote & YouTube Meditation Music */}
            <QuoteSection
              currentQuote={currentQuote}
              onNextQuote={handleNextQuote}
              onInsertQuoteToJournal={handleInsertQuoteToJournal}
            />

            <MusicPlayerSection
              selectedMusic={selectedMusic}
              onSelectMusic={setSelectedMusic}
              customMusicList={customMusicList}
              setCustomMusicList={setCustomMusicList}
            />

            {/* Bottom: Mindset & Reflection Journal Form */}
            <JournalEditor
              currentDateKey={currentDateKey}
              onDateChange={setCurrentDateKey}
              existingEntry={entries[currentDateKey] || null}
              onEntrySaved={refreshData}
              selectedMusic={selectedMusic}
              currentQuote={currentQuote}
            />
          </div>
        )}

        {currentTab === 'calendar' && (
          <div className="animate-fadeIn">
            <CalendarView
              entries={entries}
              onSelectDateToEdit={handleSelectDateToEdit}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        )}

        {currentTab === 'archive' && (
          <div className="animate-fadeIn">
            <ArchiveSearchView
              entries={entries}
              onSelectDateToEdit={handleSelectDateToEdit}
              onDeleteEntry={handleDeleteEntry}
              onOpenBackup={() => setIsBackupOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200/60 dark:border-stone-800 text-center text-xs text-stone-400">
        <p>Morning Mindset · 매일 아침 온전한 나와 마주하는 시간</p>
      </footer>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataReload={refreshData}
      />
    </div>
  );
}
