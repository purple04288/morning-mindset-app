import React from 'react';
import { X, Flame, Award, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { MOODS } from '../data/curatedContent';

export default function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const total = stats.totalEntries || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
              나의 모닝 루틴 통계
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400 block font-serif-kr">
              {stats.currentStreak}일
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">현재 연속 기록</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
            <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400 block font-serif-kr">
              {stats.longestStreak}일
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">최장 연속 기록</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
            <Calendar className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block font-serif-kr">
              {stats.totalEntries}회
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">총 누적 세션</span>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300">
            가장 많이 느낀 아침 감정 분포
          </h4>
          {total > 0 ? (
            <div className="space-y-2">
              {MOODS.map(m => {
                const count = stats.moodCounts?.[m.id] || 0;
                const percentage = Math.round((count / total) * 100);
                if (count === 0) return null;
                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">{count}회 ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-3 text-center">
              아직 기록된 감정 데이터가 없습니다.
            </p>
          )}
        </div>

        {/* Motivational Toast */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>작은 아침 루틴의 반복이 당신의 삶 전체를 변화시킵니다. 오늘도 응원합니다!</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold transition-opacity hover:opacity-90"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
