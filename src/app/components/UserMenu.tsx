import { useState, useRef, useEffect } from "react";
import {
  User,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { translations, Language } from "../translations";

interface UserMenuProps {
  userName: string;
  onLogout: () => void;
  onViewFavorites?: () => void;
  onOpenChat?: () => void;
  onOpenSettings?: () => void;
  favoritesCount?: number;
  language: Language;
}

export function UserMenu({
  userName,
  onLogout,
  onViewFavorites,
  onOpenChat,
  onOpenSettings,
  favoritesCount = 0,
  language,
}: UserMenuProps) {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-gray-700">
          {userName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-900">
              {userName}
            </p>
            <p className="text-sm text-gray-500">
              {t.memberSince}
            </p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                if (onViewFavorites) {
                  onViewFavorites();
                  setIsOpen(false);
                }
              }}
              className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {t.myFavorites}
                </span>
              </div>
              {favoritesCount > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat();
                  setIsOpen(false);
                }
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                {t.chatroom}
              </span>
            </button>

            <button
              onClick={() => {
                if (onOpenSettings) {
                  onOpenSettings();
                  setIsOpen(false);
                }
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">
                {t.settings}
              </span>
            </button>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}