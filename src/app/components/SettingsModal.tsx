import { X, Globe } from "lucide-react";
import {
  Language,
  languageNames,
  translations,
} from "../translations";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const t = translations[currentLanguage];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.settings}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t.language}
              </div>
            </label>
            <div className="space-y-2">
              {(Object.keys(languageNames) as Language[]).map(
                (lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      currentLanguage === lang
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {languageNames[lang]}
                      </span>
                      {currentLanguage === lang && (
                        <span className="text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}