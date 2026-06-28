import {
  X,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
} from "lucide-react";
import { ReviewSection } from "./ReviewSection";
import { Language, translations } from "../translations";
import logo from "../../img/logo.webp";

interface IceCreamShop {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  hours: string;
  phone: string;
  specialty: string;
  image: string;
}

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ShopDetailsModalProps {
  shop: IceCreamShop | null;
  onClose: () => void;
  reviews: Review[];
  currentUser: { email: string; name: string } | null;
  onAddReview: (
    shopId: number,
    rating: number,
    comment: string,
  ) => void;
  language: Language;
}

export function ShopDetailsModal({
  shop,
  onClose,
  reviews,
  currentUser,
  onAddReview,
  language,
}: ShopDetailsModalProps) {
  if (!shop) return null;

  const shopReviews = reviews.filter(
    (r) => r.shopId === shop.id,
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute inset-0 flex items-center justify-center text-8xl">
            {/* 🍦 */}
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {shop.name}
              </h2>
              <p className="text-lg text-pink-600 font-medium">
                {shop.specialty}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {shop.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({shop.reviews} {translations[language].reviews})
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 mt-0.5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {shop.address}
                </p>
                <p className="text-sm text-gray-600">
                  {shop.distance}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {translations[language].schedule}
                </p>
                <p className="text-sm text-gray-600">
                  {shop.hours}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {translations[language].phone}
                </p>
                <p className="text-sm text-gray-600">
                  {shop.phone}
                </p>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors"
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${encodeURIComponent(shop.address)}`,
                "_blank",
              )
            }
          >
            <Navigation className="w-5 h-5" />
            {translations[language].getDirections}
          </button>

          <ReviewSection
            shopId={shop.id}
            reviews={shopReviews}
            currentUser={currentUser}
            onAddReview={onAddReview}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}