import React, { useState } from 'react';
import { Play, Pause, ExternalLink, Plus, Music, Volume2, Sparkles, Check, Trash2 } from 'lucide-react';
import { CURATED_MUSIC } from '../data/curatedContent';
import { saveCustomMusic, deleteCustomMusic } from '../utils/storage';

export default function MusicPlayerSection({ 
  selectedMusic, 
  onSelectMusic, 
  customMusicList, 
  setCustomMusicList 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Extract YouTube ID from various URL formats
  function extractYoutubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Combine curated and custom music
  const allMusic = [...customMusicList, ...CURATED_MUSIC];

  const categories = ['ALL', '명상 & 호흡', '피아노 & 클래식', '활력 & 에너지', '자연의 소리', '집중 & 로파이', '나의 플레이리스트'];

  const filteredMusic = allMusic.filter(item => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === '나의 플레이리스트') return item.isCustom;
    return item.category === activeCategory;
  });

  const handleAddCustomMusic = (e) => {
    e.preventDefault();
    const ytId = extractYoutubeId(newUrl);
    if (!ytId) {
      alert('유효한 유튜브 영상 주소를 입력해주세요. (예: https://www.youtube.com/watch?v=...)');
      return;
    }
    if (!newTitle.trim()) {
      alert('음악 제목을 입력해주세요.');
      return;
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: '나의 플레이리스트',
      tag: 'Custom',
      duration: 'Custom',
      youtubeId: ytId,
      youtubeUrl: newUrl.trim(),
      description: newDesc.trim() || '내가 직접 등록한 아침 루틴 음악입니다.',
      isCustom: true
    };

    const updated = saveCustomMusic(newItem);
    setCustomMusicList(updated);
    onSelectMusic(newItem);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDeleteCustom = (e, id) => {
    e.stopPropagation();
    if (confirm('이 음악을 플레이리스트에서 삭제하시겠습니까?')) {
      const updated = deleteCustomMusic(id);
      setCustomMusicList(updated);
      if (selectedMusic?.id === id) {
        onSelectMusic(CURATED_MUSIC[0]);
      }
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80 dark:border-stone-800 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <Music className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
              아침 명상 & 집중 음악
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            아침의 뇌파를 안정시키고 온전한 몰입을 돕는 추천 유튜브 음악입니다.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>나만의 유튜브 링크 추가</span>
        </button>
      </div>

      {/* Featured Video Embed & Current Player */}
      {selectedMusic && (
        <div className="mb-6 rounded-xl overflow-hidden bg-black/95 shadow-md border border-stone-800">
          <div className="relative aspect-video w-full max-h-[380px] bg-stone-950">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${selectedMusic.youtubeId}?rel=0&modestbranding=1&autoplay=0`}
              title={selectedMusic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-stone-900 text-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedMusic.category}
                </span>
                <span className="text-xs text-stone-400">
                  {selectedMusic.duration}
                </span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-stone-100">
                {selectedMusic.title}
              </h3>
              <p className="text-xs text-stone-400">
                {selectedMusic.description}
              </p>
            </div>

            <a
              href={selectedMusic.youtubeUrl || `https://www.youtube.com/watch?v=${selectedMusic.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shrink-0 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>유튜브에서 직접 보기</span>
            </a>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Music Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMusic.map(item => {
          const isSelected = selectedMusic?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectMusic(item)}
              className={`group p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-sm ring-1 ring-amber-500'
                  : 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 hover:border-amber-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        <Check className="w-3.5 h-3.5" /> 재생 중
                      </span>
                    )}
                    {item.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustom(e, item.id)}
                        className="p-1 text-stone-400 hover:text-red-500 rounded transition-colors"
                        title="플레이리스트에서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                <span>{item.duration}</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:underline flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> 선택
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Music Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-kr mb-1">
              나만의 아침 음악(유튜브) 추가
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              평소 아침 명상이나 집중할 때 즐겨 듣는 유튜브 영상 주소를 등록하세요.
            </p>

            <form onSubmit={handleAddCustomMusic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  음악 제목 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 내가 좋아하는 빗소리 명상"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  유튜브 URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  한 줄 설명 (선택)
                </label>
                <input
                  type="text"
                  placeholder="예: 30분 동안 온전히 멍때리며 마음 비우기"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
