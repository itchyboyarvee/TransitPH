import React, { useState } from 'react';
import {
  Languages,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { COMMUTER_PHRASES } from '../../data/seedData';
import { CommuterPhrase, PhraseCategory } from '../../types';
import { getPreferredLanguage, setPreferredLanguage } from '../../services/storage';

export const AssistedNavigationScreen: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fil' | 'bikol'>(() => getPreferredLanguage());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSpeakingId, setActiveSpeakingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories: ('ALL' | PhraseCategory)[] = [
    'ALL',
    'Directions',
    'Transportation',
    'Fare',
    'Getting Off',
  ];

  const handleLanguageChange = (lang: 'en' | 'fil' | 'bikol') => {
    setSelectedLang(lang);
    setPreferredLanguage(lang);
  };

  const speakPhrase = (phrase: CommuterPhrase) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = phrase.english;
    let langCode = 'en-US';

    if (selectedLang === 'fil') {
      textToSpeak = phrase.filipino;
      langCode = 'fil-PH'; // Fallback to en/tl depending on system voices
    } else if (selectedLang === 'bikol') {
      textToSpeak = phrase.bikol;
      langCode = 'fil-PH';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slightly slower for clarity

    utterance.onstart = () => {
      setActiveSpeakingId(phrase.id);
    };

    utterance.onend = () => {
      setActiveSpeakingId(null);
    };

    utterance.onerror = () => {
      setActiveSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (phrase: CommuterPhrase) => {
    const text =
      selectedLang === 'fil'
        ? phrase.filipino
        : selectedLang === 'bikol'
        ? phrase.bikol
        : phrase.english;

    navigator.clipboard.writeText(text);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPhrases = COMMUTER_PHRASES.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Languages className="w-5 h-5 text-purple-600" />
          <span>Assisted Commuter Navigation</span>
        </h2>
        <p className="text-xs text-slate-500">
          Essential phrases, transit etiquette, and voice pronunciation for Philippine jeepney and bus commuting.
        </p>
      </div>

      {/* Language Selector Card */}
      <div className="bg-purple-900 text-white rounded-2xl p-4 shadow-sm border border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-200">Active Dialect / Language:</span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-800 px-2 py-0.5 rounded text-purple-200">
            TTS Audio Supported
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLanguageChange('fil')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
              selectedLang === 'fil'
                ? 'bg-white text-purple-950 font-bold shadow-md'
                : 'bg-purple-800/80 text-purple-200 hover:bg-purple-800'
            }`}
          >
            Filipino (Tagalog)
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange('bikol')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
              selectedLang === 'bikol'
                ? 'bg-white text-purple-950 font-bold shadow-md'
                : 'bg-purple-800/80 text-purple-200 hover:bg-purple-800'
            }`}
          >
            Bikol (Regional)
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
              selectedLang === 'en'
                ? 'bg-white text-purple-950 font-bold shadow-md'
                : 'bg-purple-800/80 text-purple-200 hover:bg-purple-800'
            }`}
          >
            English
          </button>
        </div>

        <p className="text-[11px] text-purple-200 mt-2.5">
          {selectedLang === 'fil' && 'Naka-set sa Filipino: Ipinapakita ang mga karaniwang pananalita para sa komyuter.'}
          {selectedLang === 'bikol' && 'Naka-set sa Bikol: Mga tataramon asin giya sa pagbiyahe para sa mga pasahero.'}
          {selectedLang === 'en' && 'Set to English: Commuter guidance & local phrasebook for CALABARZON transit.'}
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-xs font-medium cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-700 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
            }`}
          >
            {cat === 'ALL' ? 'All Phrases' : cat}
          </button>
        ))}
      </div>

      {/* Phrases List */}
      <div className="space-y-3">
        {filteredPhrases.map((phrase) => {
          const isSpeaking = activeSpeakingId === phrase.id;
          const isCopied = copiedId === phrase.id;

          const primaryText =
            selectedLang === 'fil'
              ? phrase.filipino
              : selectedLang === 'bikol'
              ? phrase.bikol
              : phrase.english;

          return (
            <div
              key={phrase.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all ${
                isSpeaking ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {phrase.category}
                  </span>

                  {/* Primary phrase text */}
                  <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                    "{primaryText}"
                  </h3>

                  {/* Secondary translation preview */}
                  <div className="mt-1 text-xs text-slate-500 space-y-0.5">
                    {selectedLang !== 'en' && (
                      <p>
                        <strong className="font-semibold text-slate-600">English:</strong> {phrase.english}
                      </p>
                    )}
                    {selectedLang !== 'fil' && (
                      <p>
                        <strong className="font-semibold text-slate-600">Filipino:</strong> {phrase.filipino}
                      </p>
                    )}
                    {selectedLang !== 'bikol' && (
                      <p>
                        <strong className="font-semibold text-slate-600">Bikol:</strong> {phrase.bikol}
                      </p>
                    )}
                  </div>

                  {/* Commuter Context Tip */}
                  <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Info className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>{phrase.context}</span>
                  </div>
                </div>

                {/* Audio and Copy Action Buttons */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => speakPhrase(phrase)}
                    title="Pronounce phrase with Audio TTS"
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isSpeaking
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(phrase)}
                    title="Copy phrase"
                    className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
