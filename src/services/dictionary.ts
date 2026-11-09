import { PersonalWord, Suggestion } from '../types/keyboard';

// Common typo corrections database
const COMMON_TYPOS: Record<string, string> = {
  'teh': 'the',
  'adn': 'and',
  'taht': 'that',
  'waht': 'what',
  'whta': 'what',
  'thier': 'their',
  'there': 'there',
  'tiher': 'their',
  'recieve': 'receive',
  'recieved': 'received',
  'seperate': 'separate',
  'definately': 'definitely',
  'wierd': 'weird',
  'dont': "don't",
  'cant': "can't",
  'wont': "won't",
  'didnt': "didn't",
  'couldnt': "couldn't",
  'shouldnt': "shouldn't",
  'wouldnt': "wouldn't",
  'isnt': "isn't",
  'arent': "aren't",
  'hasnt': "hasn't",
  'havent': "haven't",
  'wasnt': "wasn't",
  'werent': "weren't",
  'im': "I'm",
  'youre': "you're",
  'theyre': "they're",
  'weve': "we've",
  'youve': "you've",
  'theyve': "they've",
  'ill': "I'll",
  'youll': "you'll",
  'hell': "he'll",
  'shell': "she'll",
  'theyll': "they'll",
  'its': "it's",
  'whats': "what's",
  'lets': "let's",
  'heres': "here's",
  'theres': "there's",
  'alot': 'a lot',
  'tommorrow': 'tomorrow',
  'tomorow': 'tomorrow',
  'untill': 'until',
  'goverment': 'government',
  'occured': 'occurred',
  'neccessary': 'necessary',
  'truely': 'truly',
  'accross': 'across',
  'embarass': 'embarrass',
  'freind': 'friend',
  'realy': 'really',
  'becuase': 'because',
  'becasue': 'because',
  'probaly': 'probably',
  'pleae': 'please',
  'thansk': 'thanks',
  'thanx': 'thanks',
  'sorry': 'sorry',
  'sory': 'sorry',
  'wrk': 'work',
  'wrok': 'work',
  'shool': 'school',
  'peopl': 'people',
  'peopel': 'people',
  'bcs': 'because',
  'omw': 'on my way',
  'brb': 'be right back',
  'idk': "I don't know",
  'btw': 'by the way',
  'np': 'no problem',
  'yw': "you're welcome",
};

// Curated high-frequency English dictionary (~1,200 standard words)
const BASE_DICTIONARY: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'great', 'between', 'need', 'large', 'under', 'water', 'around', 'house', 'world',
  'school', 'still', 'try', 'last', 'ask', 'feel', 'place', 'system', 'number', 'long', 'small', 'own',
  'found', 'life', 'call', 'live', 'high', 'might', 'must', 'next', 'run', 'group', 'problem', 'begin',
  'help', 'talk', 'turn', 'start', 'show', 'hear', 'play', 'move', 'like', 'live', 'believe', 'hold',
  'bring', 'happen', 'write', 'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include', 'continue',
  'set', 'learn', 'change', 'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read',
  'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember', 'love', 'consider',
  'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall', 'cut', 'reach',
  'kill', 'remain', 'suggest', 'raise', 'pass', 'sell', 'require', 'report', 'decide', 'pull', 'thank',
  'thanks', 'please', 'hello', 'welcome', 'morning', 'night', 'evening', 'today', 'tomorrow', 'yesterday',
  'keyboard', 'android', 'mobile', 'typing', 'privacy', 'simple', 'fast', 'smooth', 'clean', 'modern',
  'purple', 'white', 'black', 'nudge', 'feature', 'settings', 'message', 'friend', 'happy', 'quick',
  'smart', 'phone', 'device', 'screen', 'touch', 'power', 'battery', 'ready', 'online', 'offline',
  'awesome', 'cool', 'perfect', 'amazing', 'together', 'always', 'never', 'sometimes', 'already',
  'beautiful', 'wonderful', 'special', 'important', 'different', 'easy', 'difficult', 'possible',
  'sound', 'listen', 'look', 'view', 'test', 'share', 'save', 'check', 'done', 'search', 'find',
  'note', 'notes', 'chat', 'talk', 'text', 'story', 'meeting', 'dinner', 'coffee', 'lunch', 'breakfast',
  'home', 'office', 'weekend', 'monday', 'friday', 'sunday', 'party', 'trip', 'travel', 'photo',
  'really', 'sure', 'true', 'false', 'fine', 'okay', 'nice', 'sweet', 'kind', 'peace', 'hope', 'wish',
  'everything', 'anything', 'nothing', 'someone', 'everyone', 'somewhere', 'anywhere', 'nowhere',
  'minute', 'hour', 'second', 'week', 'month', 'morning', 'afternoon', 'tonight', 'soon', 'later'
];

// QWERTY adjacent key map to compute proximity penalty
const ADJACENT_KEYS: Record<string, string[]> = {
  'q': ['w', 'a', 's', '1', '2'],
  'w': ['q', 'e', 's', 'a', 'd', '2', '3'],
  'e': ['w', 'r', 'd', 's', 'f', '3', '4'],
  'r': ['e', 't', 'f', 'd', 'g', '4', '5'],
  't': ['r', 'y', 'g', 'f', 'h', '5', '6'],
  'y': ['t', 'u', 'h', 'g', 'j', '6', '7'],
  'u': ['y', 'i', 'j', 'h', 'k', '7', '8'],
  'i': ['u', 'o', 'k', 'j', 'l', '8', '9'],
  'o': ['i', 'p', 'l', 'k', '9', '0'],
  'p': ['o', 'l', '0'],
  'a': ['q', 'w', 's', 'z'],
  's': ['a', 'w', 'e', 'd', 'x', 'z'],
  'd': ['s', 'e', 'r', 'f', 'c', 'x'],
  'f': ['d', 'r', 't', 'g', 'v', 'c'],
  'g': ['f', 't', 'y', 'h', 'b', 'v'],
  'h': ['g', 'y', 'u', 'j', 'n', 'b'],
  'j': ['h', 'u', 'i', 'k', 'm', 'n'],
  'k': ['j', 'i', 'o', 'l', 'm'],
  'l': ['k', 'o', 'p'],
  'z': ['a', 's', 'x'],
  'x': ['z', 's', 'd', 'c'],
  'c': ['x', 'd', 'f', 'v'],
  'v': ['c', 'f', 'g', 'b'],
  'b': ['v', 'g', 'h', 'n'],
  'n': ['b', 'h', 'j', 'm'],
  'm': ['n', 'j', 'k']
};

class DictionaryService {
  private personalWords: Map<string, PersonalWord> = new Map();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || this.initialized) return;
    try {
      const stored = localStorage.getItem('nudge_personal_dictionary');
      if (stored) {
        const parsed: PersonalWord[] = JSON.parse(stored);
        parsed.forEach(item => {
          this.personalWords.set(item.word.toLowerCase(), item);
        });
      } else {
        // Seed initial friendly personal words
        const defaultPersonal: PersonalWord[] = [
          { word: 'Nudge', frequency: 15, addedAt: Date.now() - 86400000, shortcut: 'ng' },
          { word: 'Dhaka', frequency: 12, addedAt: Date.now() - 86400000 },
          { word: 'QWERTY', frequency: 8, addedAt: Date.now() - 43200000 },
          { word: 'Adda', frequency: 6, addedAt: Date.now() - 20000000 },
        ];
        defaultPersonal.forEach(p => this.personalWords.set(p.word.toLowerCase(), p));
        this.savePersonalWords();
      }
      this.initialized = true;
    } catch {
      // Fallback
    }
  }

  private savePersonalWords() {
    if (typeof window === 'undefined') return;
    try {
      const array = Array.from(this.personalWords.values());
      localStorage.setItem('nudge_personal_dictionary', JSON.stringify(array));
    } catch {
      // Storage error
    }
  }

  getPersonalWordsList(): PersonalWord[] {
    this.init();
    return Array.from(this.personalWords.values()).sort((a, b) => b.frequency - a.frequency);
  }

  addPersonalWord(word: string, shortcut?: string): boolean {
    this.init();
    const clean = word.trim();
    if (!clean) return false;
    const lower = clean.toLowerCase();

    const existing = this.personalWords.get(lower);
    if (existing) {
      existing.frequency += 1;
      if (shortcut) existing.shortcut = shortcut;
      this.personalWords.set(lower, existing);
    } else {
      this.personalWords.set(lower, {
        word: clean,
        frequency: 1,
        addedAt: Date.now(),
        shortcut
      });
    }
    this.savePersonalWords();
    return true;
  }

  removePersonalWord(word: string) {
    this.init();
    this.personalWords.delete(word.toLowerCase());
    this.savePersonalWords();
  }

  clearPersonalDictionary() {
    this.init();
    this.personalWords.clear();
    this.savePersonalWords();
  }

  recordWordUsage(word: string) {
    this.init();
    const clean = word.trim();
    if (clean.length < 2) return;
    const lower = clean.toLowerCase();

    // If already in personal dictionary, increment frequency
    if (this.personalWords.has(lower)) {
      const item = this.personalWords.get(lower)!;
      item.frequency += 1;
      this.personalWords.set(lower, item);
      this.savePersonalWords();
    }
  }

  exportDictionaryJson(): string {
    this.init();
    return JSON.stringify(Array.from(this.personalWords.values()), null, 2);
  }

  importDictionaryJson(jsonStr: string): { success: boolean; count: number; error?: string } {
    try {
      const items: PersonalWord[] = JSON.parse(jsonStr);
      if (!Array.isArray(items)) throw new Error('Not an array');
      let count = 0;
      items.forEach(item => {
        if (item && typeof item.word === 'string') {
          this.personalWords.set(item.word.toLowerCase(), {
            word: item.word,
            frequency: typeof item.frequency === 'number' ? item.frequency : 1,
            addedAt: item.addedAt || Date.now(),
            shortcut: item.shortcut
          });
          count++;
        }
      });
      this.savePersonalWords();
      return { success: true, count };
    } catch (e: unknown) {
      return { success: false, count: 0, error: (e as Error).message || 'Invalid JSON format' };
    }
  }

  isWordKnown(word: string): boolean {
    this.init();
    const lower = word.toLowerCase();
    return (
      BASE_DICTIONARY.includes(lower) ||
      this.personalWords.has(lower) ||
      COMMON_TYPOS[lower] !== undefined
    );
  }

  // Levenshtein distance with keyboard adjacency weighting
  private getDistance(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          const charA = a.charAt(j - 1);
          const charB = b.charAt(i - 1);
          const isAdjacent = ADJACENT_KEYS[charA]?.includes(charB);
          const substitutionCost = isAdjacent ? 0.7 : 1.0;

          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + substitutionCost, // substitution
            matrix[i][j - 1] + 1,                   // insertion
            matrix[i - 1][j] + 1                    // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Transparent suggestions generation
   * Output: Exactly 3 suggestions:
   *  - Left: Original/verbatim (e.g. "teh" or "bhalo") - lets user keep what they wrote
   *  - Center: Best correction or top match (highlighted)
   *  - Right: Alternative or completion or "+ Add to Dictionary"
   */
  getSuggestions(token: string): Suggestion[] {
    this.init();
    if (!token || !token.trim()) return [];

    const raw = token;
    const lower = token.toLowerCase();
    const isCapitalized = /^[A-Z][a-z]*$/.test(raw);
    const isAllCaps = /^[A-Z]{2,}$/.test(raw);

    const applyCasing = (w: string) => {
      if (isAllCaps) return w.toUpperCase();
      if (isCapitalized) return w.charAt(0).toUpperCase() + w.slice(1);
      return w;
    };

    // 1. Direct typo check
    if (COMMON_TYPOS[lower]) {
      const fixed = applyCasing(COMMON_TYPOS[lower]);
      return [
        { word: `"${raw}"`, isOriginal: true, confidence: 0.3 },
        { word: fixed, isAutocorrect: true, confidence: 0.95 },
        { word: fixed + '...', confidence: 0.5 }
      ];
    }

    // 2. Shortcut check from personal dictionary
    for (const pw of this.personalWords.values()) {
      if (pw.shortcut && pw.shortcut.toLowerCase() === lower) {
        return [
          { word: `"${raw}"`, isOriginal: true, confidence: 0.3 },
          { word: pw.word, isAutocorrect: true, isLearned: true, confidence: 0.98 },
          { word: applyCasing(pw.word), confidence: 0.6 }
        ];
      }
    }

    // 3. Exact match in personal dictionary or base
    const personalMatch = this.personalWords.get(lower);
    if (personalMatch) {
      return [
        { word: raw, isOriginal: true, confidence: 0.9 },
        { word: personalMatch.word, isLearned: true, confidence: 1.0 },
        { word: personalMatch.word + 's', confidence: 0.4 }
      ];
    }

    if (BASE_DICTIONARY.includes(lower)) {
      // Find completions
      const completions = BASE_DICTIONARY.filter(w => w !== lower && w.startsWith(lower)).slice(0, 2);
      return [
        { word: raw, isOriginal: true, confidence: 0.9 },
        { word: applyCasing(lower), isAutocorrect: false, confidence: 1.0 },
        { word: completions[0] ? applyCasing(completions[0]) : raw + '!', confidence: 0.5 }
      ];
    }

    // 4. Prefix search (user is halfway typing a word)
    const prefixMatches: string[] = [];
    for (const w of BASE_DICTIONARY) {
      if (w.startsWith(lower)) {
        prefixMatches.push(w);
        if (prefixMatches.length >= 4) break;
      }
    }

    for (const pw of this.personalWords.values()) {
      if (pw.word.toLowerCase().startsWith(lower) && !prefixMatches.includes(pw.word.toLowerCase())) {
        prefixMatches.unshift(pw.word);
      }
    }

    if (prefixMatches.length > 0) {
      const best = applyCasing(prefixMatches[0]);
      const second = prefixMatches[1] ? applyCasing(prefixMatches[1]) : '';
      return [
        { word: `"${raw}"`, isOriginal: true, confidence: 0.4 },
        { word: best, isAutocorrect: false, confidence: 0.85 },
        { word: second || best, confidence: 0.6 }
      ];
    }

    // 5. Fuzzy match / distance correction
    const candidates: { word: string; dist: number; isLearned?: boolean }[] = [];

    // Check personal dictionary first
    for (const pw of this.personalWords.values()) {
      const d = this.getDistance(lower, pw.word.toLowerCase());
      if (d <= 2) {
        candidates.push({ word: pw.word, dist: d - 0.3, isLearned: true }); // boost personal
      }
    }

    // Check base dictionary
    for (const w of BASE_DICTIONARY) {
      const d = this.getDistance(lower, w);
      if (d <= 2) {
        candidates.push({ word: w, dist: d });
      }
    }

    candidates.sort((a, b) => a.dist - b.dist);

    if (candidates.length > 0) {
      const best = candidates[0];
      const second = candidates[1];
      const isHighConfidence = best.dist <= 1.2 && raw.length >= 3;

      return [
        { word: `"${raw}"`, isOriginal: true, confidence: 0.4 },
        {
          word: applyCasing(best.word),
          isAutocorrect: isHighConfidence,
          isLearned: best.isLearned,
          confidence: isHighConfidence ? 0.9 : 0.6
        },
        second
          ? { word: applyCasing(second.word), isLearned: second.isLearned, confidence: 0.5 }
          : { word: `+ Add "${raw}"`, isLearned: false, confidence: 0.3 }
      ];
    }

    // 6. Unknown word entirely -> Offer Add to dictionary
    return [
      { word: raw, isOriginal: true, confidence: 0.8 },
      { word: `+ Add "${raw}"`, isLearned: false, confidence: 0.5 },
      { word: raw + 's', confidence: 0.3 }
    ];
  }
}

export const dictionaryService = new DictionaryService();
