import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Music, Quote, Edit3, Trash2, Heart, Sparkles } from 'lucide-react';
import { MOODS } from '../data/curatedContent';
import { formatKoreanDate, formatDateKey } from '../utils/storage';

export default function CalendarView({ 
  entries, 
  onSelectDateToEdit, 
  onDeleteEntry 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateKey(formatDateKey(today));
  };

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${mStr}-${dStr}`;
    days.push({
      dayNumber: d,
      dateKey,
      entry: entries[dateKey] || null
    });
  }

  const selectedEntry = entries[selectedDateKey] || null;
  const moodMeta = selectedEntry?.mood ? MOODS.find(m => m.id === selectedEntry.mood) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
              {year}년 {month + 1}월
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 font-medium transition-colors"
            >
              오늘
            </button>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 mb-2">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />;
            }

            const isSelected = item.dateKey === selectedDateKey;
            const isToday = item.dateKey === formatDateKey(new Date());
            const hasEntry = !!item.entry;
            const itemMood = hasEntry ? MOODS.find(m => m.id === item.entry.mood) : null;

            return (
              <button
                key={item.dateKey}
                onClick={() => setSelectedDateKey(item.dateKey)}
                className={`h-14 sm:h-16 p-1 rounded-xl text-left flex flex-col justify-between transition-all border ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-sm ring-1 ring-amber-500'
                    : isToday
                    ? 'border-stone-400 dark:border-stone-600 bg-stone-100/70 dark:bg-stone-800/60'
                    : 'border-stone-100 dark:border-stone-800/80 bg-white/40 dark:bg-stone-900/40 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[11px] font-semibold ${isToday ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-700 dark:text-stone-300'}`}>
                    {item.dayNumber}
                  </span>
                  {hasEntry && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>

                {hasEntry ? (
                  <div className="flex items-center justify-center text-sm py-0.5">
                    <span>{itemMood?.emoji || '✨'}</span>
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Detail Card */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 font-serif-kr">
                {formatKoreanDate(selectedDateKey)}
              </h3>
              <p className="text-[11px] text-stone-400">
                {selectedEntry ? '기록이 저장된 날' : '작성된 기록이 없습니다'}
              </p>
            </div>

            {selectedEntry && (
              <button
                onClick={() => onSelectDateToEdit(selectedDateKey)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-medium flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>수정하기</span>
              </button>
            )}
          </div>

          {selectedEntry ? (
            <div className="space-y-4">
              {/* Mood Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">아침 마음가짐:</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${moodMeta?.color || 'bg-stone-100 text-stone-700'}`}>
                  <span>{moodMeta?.emoji}</span>
                  <span>{moodMeta?.label || '기록됨'}</span>
                </span>
              </div>

              {/* Mindset Statement */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                <h4 className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                  오늘의 다짐 & 태도
                </h4>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-serif-kr leading-relaxed">
                  “{selectedEntry.mindset}”
                </p>
              </div>

              {/* Gratitudes */}
              {selectedEntry.gratitudes && selectedEntry.gratitudes.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    아침 감사 3가지
                  </h4>
                  <ul className="space-y-1">
                    {selectedEntry.gratitudes.map((g, i) => (
                      <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reflection Notes */}
              {selectedEntry.notes && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    성찰 및 메모
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed bg-white/60 dark:bg-stone-900/40 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                    {selectedEntry.notes}
                  </p>
                </div>
              )}

              {/* Linked Music & Quote */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
                {selectedEntry.music && (
                  <div className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-medium text-stone-700 dark:text-stone-300">{selectedEntry.music.title}</span>
                  </div>
                )}
                {selectedEntry.quote && (
                  <div className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="italic">“{selectedEntry.quote.content}” — {selectedEntry.quote.author}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400 space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
              <p className="text-xs">
                이 날짜에는 아직 작성된 마음가짐 기록이 없습니다.
              </p>
              <button
                onClick={() => onSelectDateToEdit(selectedDateKey)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                이 날짜의 기록 작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
