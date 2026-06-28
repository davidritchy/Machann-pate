import { useState } from "react";
import { Star, Send } from "lucide-react";
import { translations, Language } from "../translations";

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ReviewSectionProps {
  shopId: number;
  reviews: Review[];
  currentUser: { email: string; name: string } | null;
  onAddReview: (shopId: number, rating: number, comment: string) => void;
  language: Language;
}

export function ReviewSection({
  shopId,
  reviews,
  currentUser,
  onAddReview,
  language,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || rating === 0 || !comment.trim()) return;

    onAddReview(shopId, rating, comment);
    setRating(0);
    setComment("");
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={
              interactive ? () => setHoverRating(star) : undefined
            }
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(
      language === "fr" ? "fr-FR" : language === "ht" ? "fr-HT" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(date);
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">
        {language === "fr"
          ? "Avis et commentaires"
          : language === "en"
          ? "Reviews & Comments"
          : "Revizyon ak Kòmantè"}
      </h3>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {language === "fr"
              ? "Laissez votre avis"
              : language === "en"
              ? "Leave your review"
              : "Kite revizyon ou"}
          </p>
          <div className="mb-3" onMouseLeave={() => setHoverRating(0)}>
            {renderStars(hoverRating || rating, true)}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              language === "fr"
                ? "Partagez votre expérience..."
                : language === "en"
                ? "Share your experience..."
                : "Pataje eksperyans ou..."
            }
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none mb-3"
          />
          <button
            type="submit"
            disabled={rating === 0 || !comment.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {language === "fr"
              ? "Publier"
              : language === "en"
              ? "Post"
              : "Pibliye"}
          </button>
        </form>
      ) : (
        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
          {language === "fr"
            ? "Connectez-vous pour laisser un avis"
            : language === "en"
            ? "Sign in to leave a review"
            : "Konekte pou kite yon revizyon"}
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {language === "fr"
              ? "Aucun avis pour le moment. Soyez le premier à partager votre expérience!"
              : language === "en"
              ? "No reviews yet. Be the first to share your experience!"
              : "Pa gen okenn revizyon ankò. Se premye moun ki pataje eksperyans ou!"}
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.userName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
