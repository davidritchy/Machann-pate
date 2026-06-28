import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { translations, Language } from "../translations";

interface Message {
  id: number;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  likes?: number;
}

interface ChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string } | null;
  language: Language;
}



const mockMessages: Message[] = [
  {
    id: 1,
    userId: "user1",
    userName: "Sophie L.",
    text: "Quelqu'un a essayé le nouveau glacier sur Saint-Laurent?",
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
  },
  {
    id: 2,
    userId: "user2",
    userName: "Marc D.",
    text: "Oui! Leurs glaces au chocolat sont incroyables 🍫",
    timestamp: new Date(Date.now() - 3000000),
    likes: 8,
  },
  {
    id: 3,
    userId: "user3",
    userName: "Julie M.",
    text: "Je recommande Gelato Amore, meilleur gelato italien à Montréal!",
    timestamp: new Date(Date.now() - 1800000),
    likes: 25,
  },
  {
    id: 4,
    userId: "user4",
    userName: "Pierre B.",
    text: "La Glacerie Artisanale a des parfums végans incroyables!",
    timestamp: new Date(Date.now() - 7200000),
    likes: 18,
  },
  {
    id: 5,
    userId: "user5",
    userName: "Emma R.",
    text: "Quelqu'un connaît un bon glacier ouvert tard le soir?",
    timestamp: new Date(Date.now() - 900000),
    likes: 3,
  },
  {
    id: 6,
    userId: "user6",
    userName: "Alex T.",
    text: "Dolce Vita est ouvert jusqu'à 23h30, c'est parfait pour les soirées d'été!",
    timestamp: new Date(Date.now() - 600000),
    likes: 15,
  },
];

export function ChatRoom({
  isOpen,
  onClose,
  currentUser,
  language,
}: ChatRoomProps) {
  const [messages, setMessages] =
    useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "recent" | "trending"
  >("recent");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: messages.length + 1,
      userId: currentUser.email,
      userName: currentUser.name,
      text: newMessage,
      timestamp: new Date(),
      likes: 0,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setActiveTab("recent");
  };

  const displayedMessages =
    activeTab === "trending"
      ? [...messages].sort(
          (a, b) => (b.likes || 0) - (a.likes || 0),
        )
      : [...messages].sort(
          (a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime(),
        );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return translations.fr.justNow;
    if (minutes < 60) return `${translations.fr.ago} ${minutes} ${translations.fr.minutes}`;
    if (hours < 24) return `${translations.fr.ago} ${hours} ${translations.fr.hours}`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full h-[600px] flex flex-col">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-t-xl">
          <div className="flex items-center justify-between mb-4 text-white">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">{t.chatroom}</h2>
                <p className="text-sm text-pink-100">
                  {translations.fr.shareRecommendations}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "recent"
                  ? "bg-white text-pink-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Clock className="w-4 h-4" />
              {translations.fr.recent}
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "trending"
                  ? "bg-white text-pink-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {translations.fr.trending}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayedMessages.map((message) => {
            const isCurrentUser =
              currentUser?.email === message.userId;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    isCurrentUser ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isCurrentUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {isCurrentUser
                        ? `${message.userName} (Vous)`
                        : message.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {(message.likes || 0) > 0 && (
                      <div
                        className={`flex items-center gap-1 mt-2 text-xs ${
                          isCurrentUser
                            ? "text-pink-100"
                            : "text-gray-500"
                        }`}
                      >
                        <span>❤️</span>
                        <span>{message.likes} {translations.fr.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                currentUser
                  ? translations.fr.writeMessage
                  : translations.fr.notLoggedIn
              }
              disabled={!currentUser}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!currentUser || !newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {translations.fr.sendMessage}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}