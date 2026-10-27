import React, { useState } from 'react';
import { X, Download, Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON } from '../utils/storage';

export default function BackupModal({ isOpen, onClose, onDataReload }) {
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const success = importDataFromJSON(text);
        if (success) {
          setImportStatus('데이터를 성공적으로 복원했습니다!');
          if (onDataReload) onDataReload();
        } else {
          setImportStatus('파일 형식이 올바르지 않습니다.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-kr">
              데이터 백업 및 복원
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          작성하신 모든 마음가짐 일기와 나만의 플레이리스트는 사용자의 브라우저 로컬 저장소에 안전하게 보관됩니다. 다른 기기로 옮기거나 안전하게 소장하려면 백업 파일을 다운로드하세요.
        </p>

        {/* Export Button */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">내보내기 (JSON 백업)</span>
            <button
              onClick={exportDataAsJSON}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>백업 파일 저장</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            지금까지 작성된 모든 날짜별 기록을 파일 하나로 다운로드합니다.
          </p>
        </div>

        {/* Import Button */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">가져오기 (백업 복원)</span>
            <label className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>JSON 파일 선택</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[11px] text-stone-400">
            기존에 백업한 JSON 파일을 업로드하여 기록을 병합·복구합니다.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
        >
          창 닫기
        </button>
      </div>
    </div>
  );
}
