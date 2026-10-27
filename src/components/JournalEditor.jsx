import React, { useState, useEffect } from 'react';
import { PenLine, Save, CheckCircle2, Heart, Sparkles, Music, Quote, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOODS } from '../data/curatedContent';
import { formatKoreanDate, formatDateKey, saveEntry, deleteEntry } from '../utils/storage';

export default function JournalEditor({ 
  currentDateKey, 
  onDateChange,
  existingEntry, 
  onEntrySaved, 
  selectedMusic, 
  currentQuote 
}) {
  const [mood, setMood] = useState('peaceful');
  const [mindset, setMindset] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // When existingEntry or currentDateKey changes, sync state
  useEffect(() => {
    if (existingEntry) {
      setMood(existingEntry.mood || 'peaceful');
      setMindset(existingEntry.mindset || '');
      setGratitude1(existingEntry.gratitudes?.[0] || '');
      setGratitude2(existingEntry.gratitudes?.[1] || '');
      setGratitude3(existingEntry.gratitudes?.[2] || '');
      setNotes(existingEntry.notes || '');
      setIsSaved(true);
      setSaveMessage('저장된 기록을 불러왔습니다.');
    } else {
      setMood('peaceful');
      setMindset('');
      setGratitude1('');
      setGratitude2('');
      setGratitude3('');
      setNotes('');
      setIsSaved(false);
      setSaveMessage('');
    }
  }, [existingEntry, currentDateKey]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!mindset.trim() && !notes.trim() && !gratitude1.trim()) {
      alert('오늘의 마음가짐이나 감사한 일, 또는 성찰 노트를 적어도 한 줄 이상 작성해주세요.');
      return;
    }

    const entryData = {
      mood,
      mindset: mindset.trim(),
      gratitudes: [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(Boolean),
      notes: notes.trim(),
      music: selectedMusic ? {
        title: selectedMusic.title,
        youtubeId: selectedMusic.youtubeId,
        youtubeUrl: selectedMusic.youtubeUrl,
        category: selectedMusic.category
      } : null,
      quote: currentQuote ? {
        author: currentQuote.author,
        book: currentQuote.book,
        content: currentQuote.content
      } : null
    };

    saveEntry(currentDateKey, entryData);
    setIsSaved(true);
    setSaveMessage('소중한 마음가짐이 성공적으로 저장되었습니다!');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
      });
    } catch (e) {
      // ignore
    }

    if (onEntrySaved) {
      onEntrySaved(currentDateKey);
    }
  };

  const handleDelete = () => {
    if (confirm(`${formatKoreanDate(currentDateKey)}의 기록을 삭제하시겠습니까?`)) {
      deleteEntry(currentDateKey);
      if (onEntrySaved) {
        onEntrySaved(currentDateKey);
      }
    }
  };

  const isToday = currentDateKey === formatDateKey(new Date());

  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800 transition-all">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <PenLine className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
              나의 마음가짐 기록 (Morning Journal)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            영상과 글귀를 마주한 후, 오늘 하루를 살아갈 당신의 다짐과 감사를 적어보세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={currentDateKey}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
          {!isToday && (
            <button
              onClick={() => onDateChange(formatDateKey(new Date()))}
              className="text-xs px-2 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-medium hover:bg-amber-100 transition-colors"
            >
              오늘로
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
            <span>오늘 아침 나의 마음 상태 (Mood)</span>
            <span className="text-stone-400 font-normal">한 가지를 선택해주세요</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
              const selected = mood === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    setMood(m.id);
                    setIsSaved(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    selected
                      ? `${m.color} ring-2 ring-amber-500/40 scale-105 shadow-sm`
                      : 'bg-white/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                  }`}
                >
                  <span className="text-sm">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. Today's Mindset & Resolution */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>오늘 하루 나의 다짐과 마음가짐 (Today's Mindset) *</span>
          </label>
          <p className="text-[11px] text-stone-400">
            예: "어떤 상황이 와도 여유를 잃지 않고, 내 통제 하에 있는 일에만 집중하자."
          </p>
          <textarea
            required
            rows={2}
            value={mindset}
            onChange={(e) => {
              setMindset(e.target.value);
              setIsSaved(false);
            }}
            placeholder="오늘 하루를 관통할 나만의 한 줄 태도와 다짐을 적어보세요..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-serif-kr"
          />
        </div>

        {/* 2. Gratitude Practice (3 Things) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">2</span>
            <span>오늘 아침 감사한 일 3가지 (Three Gratitudes)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="1. 따뜻한 차 한 잔의 여유"
              value={gratitude1}
              onChange={(e) => {
                setGratitude1(e.target.value);
                setIsSaved(false);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="2. 맑고 상쾌한 아침 공기"
              value={gratitude2}
              onChange={(e) => {
                setGratitude2(e.target.value);
                setIsSaved(false);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="3. 새로운 기회가 주어진 하루"
              value={gratitude3}
              onChange={(e) => {
                setGratitude3(e.target.value);
                setIsSaved(false);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 3. Free Reflection & Meditation Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            <span>음악과 글을 감상한 후 자유로운 생각 (Reflection & Notes)</span>
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setIsSaved(false);
            }}
            placeholder="음악을 들으며 머릿속을 스쳐 지나간 생각, 오늘 풀어야 할 중요한 과제, 스스로에게 건네는 격려의 말 등을 자유롭게 남겨보세요..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-serif-kr"
          />
        </div>

        {/* Linked Media Snapshot */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-3">
            {selectedMusic && (
              <span className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-300">
                <Music className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate max-w-[180px]">{selectedMusic.title}</span>
              </span>
            )}
            {currentQuote && (
              <span className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-300">
                <Quote className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentQuote.author}</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-400">
            기록 저장 시 오늘 들은 음악과 글귀가 함께 박제됩니다.
          </span>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {existingEntry && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>기록 삭제</span>
              </button>
            )}
            {isSaved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>오늘의 마음가짐 저장하기</span>
          </button>
        </div>
      </form>
    </section>
  );
}
