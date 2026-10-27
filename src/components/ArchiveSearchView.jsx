import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Music, Quote, Edit3, Trash2, Download, Upload, Sparkles, BookOpen } from 'lucide-react';
import { MOODS } from '../data/curatedContent';
import { formatKoreanDate, exportDataAsJSON } from '../utils/storage';

export default function ArchiveSearchView({ 
  entries, 
  onSelectDateToEdit, 
  onDeleteEntry,
  onOpenBackup 
}) {
  const [keyword, setKeyword] = useState('');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // desc: latest first

  const entryList = useMemo(() => {
    const list = Object.keys(entries).map(key => ({
      dateKey: key,
      ...entries[key]
    }));

    return list.filter(item => {
      // Mood filter
      if (selectedMood !== 'ALL' && item.mood !== selectedMood) {
        return false;
      }

      // Keyword filter
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const mindsetMatch = item.mindset?.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        const gratitudesMatch = item.gratitudes?.some(g => g.toLowerCase().includes(q));
        const quoteMatch = item.quote?.content?.toLowerCase().includes(q) || item.quote?.author?.toLowerCase().includes(q);
        const musicMatch = item.music?.title?.toLowerCase().includes(q);
        const dateMatch = item.dateKey.includes(q);

        return mindsetMatch || notesMatch || gratitudesMatch || quoteMatch || musicMatch || dateMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.dateKey.localeCompare(a.dateKey);
      }
      return a.dateKey.localeCompare(b.dateKey);
    });
  }, [entries, keyword, selectedMood, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                <Search className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
                전체 마음가짐 기록 검색
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              날짜, 키워드, 감정 상태별로 지난 아침의 다짐과 감사를 찾아보세요. (총 {entryList.length}건)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDataAsJSON}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>백업 다운로드</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="검색어 입력 (다짐 내용, 감사한 일, 명언, 날짜 등)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">전체 감정 (All Moods)</option>
              {MOODS.map(m => (
                <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="desc">최신 날짜순 (Newest)</option>
              <option value="asc">과거 날짜순 (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {entryList.length > 0 ? (
        <div className="space-y-4">
          {entryList.map(item => {
            const moodMeta = MOODS.find(m => m.id === item.mood);
            return (
              <div 
                key={item.dateKey}
                className="glass-card rounded-2xl p-5 shadow-sm border border-stone-200/80 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-kr">
                      {formatKoreanDate(item.dateKey)}
                    </span>
                    {moodMeta && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${moodMeta.color}`}>
                        <span>{moodMeta.emoji}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => onSelectDateToEdit(item.dateKey)}
                      className="text-xs px-2.5 py-1 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => onDeleteEntry(item.dateKey)}
                      className="text-xs px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>

                {/* Mindset */}
                {item.mindset && (
                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                      오늘의 다짐
                    </span>
                    <p className="text-xs sm:text-sm font-serif-kr text-stone-900 dark:text-stone-100">
                      “{item.mindset}”
                    </p>
                  </div>
                )}

                {/* Gratitudes */}
                {item.gratitudes && item.gratitudes.length > 0 && (
                  <div className="text-xs text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-stone-500 text-[11px] block mb-1">아침 감사 목록:</span>
                    <ul className="space-y-0.5 pl-3 list-disc text-stone-600 dark:text-stone-300">
                      {item.gratitudes.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 whitespace-pre-wrap line-clamp-3 bg-white/40 dark:bg-stone-900/30 p-2.5 rounded-lg">
                    {item.notes}
                  </p>
                )}

                {/* Music & Quote Meta */}
                {(item.music || item.quote) && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                    {item.music && (
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-amber-500" />
                        <span>{item.music.title}</span>
                      </span>
                    )}
                    {item.quote && (
                      <span className="flex items-center gap-1">
                        <Quote className="w-3 h-3 text-emerald-500" />
                        <span>{item.quote.author}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-stone-400 space-y-3 border border-stone-200 dark:border-stone-800">
          <BookOpen className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-sm">
            {keyword || selectedMood !== 'ALL'
              ? '검색 조건에 일치하는 기록이 없습니다.'
              : '아직 저장된 마음가짐 기록이 없습니다. 오늘 첫 번째 아침 루틴을 시작해보세요!'}
          </p>
        </div>
      )}
    </div>
  );
}
