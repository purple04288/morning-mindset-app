// LocalStorage Storage Keys
const STORAGE_KEY_ENTRIES = "morning_mindset_entries_v1";
const STORAGE_KEY_CUSTOM_MUSIC = "morning_mindset_custom_music_v1";
const STORAGE_KEY_FAVORITES = "morning_mindset_favorites_v1";
const STORAGE_KEY_SETTINGS = "morning_mindset_settings_v1";

// Helper: Format Date to YYYY-MM-DD (Local Time)
export function formatDateKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: Friendly Korean Date Display
export function formatKoreanDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return `${y}년 ${m}월 ${d}일 ${days[dateObj.getDay()]}`;
}

// Load All Journal Entries
export function loadAllEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load entries from localStorage", err);
    return {};
  }
}

// Get Entry by Date Key
export function getEntryByDate(dateKey) {
  const all = loadAllEntries();
  return all[dateKey] || null;
}

// Save or Update Entry
export function saveEntry(dateKey, entryData) {
  try {
    const all = loadAllEntries();
    const existing = all[dateKey] || {};
    
    all[dateKey] = {
      ...existing,
      ...entryData,
      dateKey,
      updatedAt: new Date().toISOString(),
      createdAt: existing.createdAt || new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(all));
    return all[dateKey];
  } catch (err) {
    console.error("Failed to save entry to localStorage", err);
    throw err;
  }
}

// Delete Entry by Date Key
export function deleteEntry(dateKey) {
  try {
    const all = loadAllEntries();
    if (all[dateKey]) {
      delete all[dateKey];
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(all));
    }
  } catch (err) {
    console.error("Failed to delete entry", err);
  }
}

// Calculate Streaks & Summary Stats
export function calculateStats(entries) {
  const keys = Object.keys(entries).sort(); // chronological
  const totalEntries = keys.length;
  if (totalEntries === 0) {
    return { totalEntries: 0, currentStreak: 0, longestStreak: 0, moodCounts: {} };
  }

  // Count moods
  const moodCounts = {};
  keys.forEach(k => {
    const mood = entries[k]?.mood;
    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
  });

  // Calculate current & longest streak
  const todayKey = formatDateKey(new Date());
  const yesterdayKey = formatDateKey(new Date(Date.now() - 86400000));
  
  let currentStreak = 0;
  let checkDate = new Date();
  
  // If no entry today, check if yesterday had an entry to keep streak alive
  if (!entries[todayKey] && entries[yesterdayKey]) {
    checkDate = new Date(Date.now() - 86400000);
  }
  
  while (true) {
    const key = formatDateKey(checkDate);
    if (entries[key]) {
      currentStreak++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  keys.forEach(k => {
    const [y, m, d] = k.split("-").map(Number);
    const curr = new Date(y, m - 1, d);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((curr - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = curr;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  });

  return {
    totalEntries,
    currentStreak,
    longestStreak,
    moodCounts
  };
}

// Export All Data as JSON file
export function exportDataAsJSON() {
  const entries = loadAllEntries();
  const customMusic = loadCustomMusic();
  const data = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    entries,
    customMusic
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `morning-mindset-backup-${formatDateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import Data from JSON file
export function importDataFromJSON(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed.entries) {
      const current = loadAllEntries();
      const merged = { ...current, ...parsed.entries };
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(merged));
    }
    if (parsed.customMusic && Array.isArray(parsed.customMusic)) {
      const currentMusic = loadCustomMusic();
      const musicMap = new Map();
      currentMusic.forEach(m => musicMap.set(m.id, m));
      parsed.customMusic.forEach(m => musicMap.set(m.id, m));
      localStorage.setItem(STORAGE_KEY_CUSTOM_MUSIC, JSON.stringify(Array.from(musicMap.values())));
    }
    return true;
  } catch (err) {
    console.error("Failed to parse import JSON", err);
    return false;
  }
}

// Custom Music Helpers
export function loadCustomMusic() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_MUSIC);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveCustomMusic(musicItem) {
  try {
    const list = loadCustomMusic();
    const updated = [musicItem, ...list.filter(m => m.id !== musicItem.id)];
    localStorage.setItem(STORAGE_KEY_CUSTOM_MUSIC, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}

export function deleteCustomMusic(id) {
  try {
    const list = loadCustomMusic();
    const updated = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_MUSIC, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}
