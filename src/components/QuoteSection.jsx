import React from 'react';
import { Quote, RefreshCw, BookmarkPlus, Sparkles, BookOpen, Heart } from 'lucide-react';

export default function QuoteSection({ 
  currentQuote, 
  onNextQuote, 
  onInsertQuoteToJournal 
}) {
  if (!currentQuote) return null;

  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800 transition-all relative overflow-hidden group">
      {/* Decorative background warm glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-200/20 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
            <Quote className="w-4 h-4" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
            오늘을 여는 마인드셋 & 영감
          </h2>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
            {currentQuote.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNextQuote}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition-colors"
            title="다른 영감 글귀 보기"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>새로운 영감 보기</span>
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="my-3 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-amber-50/50 via-white/40 to-stone-50/50 dark:from-stone-900/80 dark:to-stone-900/40 border border-amber-100/60 dark:border-stone-800/80">
        <p className="text-stone-800 dark:text-stone-200 text-base sm:text-lg leading-relaxed font-serif-kr italic">
          “{currentQuote.content}”
        </p>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-amber-200/40 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-stone-800 dark:text-stone-200">{currentQuote.author}</span>
            {currentQuote.book && <span className="text-stone-400">· 《{currentQuote.book}》</span>}
          </div>

          <button
            onClick={() => onInsertQuoteToJournal(currentQuote)}
            className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium flex items-center gap-1 transition-colors hover:underline"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>이 글귀를 내 다이어리에 인용하기</span>
          </button>
        </div>
      </div>

      {/* Reflection Question */}
      {currentQuote.reflectionPrompt && (
        <div className="mt-3 px-4 py-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 dark:text-emerald-200">
            <span className="font-bold">오늘의 마인드셋 성찰 질문: </span>
            <span>{currentQuote.reflectionPrompt}</span>
          </div>
        </div>
      )}
    </section>
  );
}
