import React from 'react';
import { Sparkles, Calendar, Search, Sun, Moon, Flame, Download, PlusCircle, BarChart3 } from 'lucide-react';
import { formatKoreanDate, formatDateKey } from '../utils/storage';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  stats, 
  darkMode, 
  setDarkMode, 
  onOpenStats,
  onOpenBackup 
}) {
  const todayFormatted = formatKoreanDate(formatDateKey(new Date()));

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-stone-900/80 border-b border-amber-100 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setCurrentTab('today')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 flex items-center justify-center shadow-md shadow-amber-200/50 dark:shadow-none group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-950 dark:text-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight font-serif-kr">
                Morning Mindset
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                아침 명상 & 마인드셋
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              {todayFormatted}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('today')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'today'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">오늘의 루틴</span>
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'calendar'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">달력 조회</span>
          </button>

          <button
            onClick={() => setCurrentTab('archive')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'archive'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Search className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">기록 검색</span>
          </button>

          {/* Streak Counter Badge */}
          <button
            onClick={onOpenStats}
            title="나의 모닝 루틴 통계 보기"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs font-semibold border border-orange-200/60 dark:border-orange-800/50 transition-colors ml-1"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{stats.currentStreak}일 연속</span>
          </button>

          {/* Backup & Export */}
          <button
            onClick={onOpenBackup}
            title="데이터 백업 및 복원"
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className="p-2 rounded-lg text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
