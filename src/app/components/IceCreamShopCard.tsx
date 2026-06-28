import {
  MapPin,
  Star,
  Clock,
  Phone,
  Heart,
} from "lucide-react";
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

interface IceCreamShopCardProps {
  shop: IceCreamShop;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (shopId: number) => void;
}

export function IceCreamShopCard({
  shop,
  onClick,
  isFavorite = false,
  onToggleFavorite,
}: IceCreamShopCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(shop.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="h-48 bg-gradient-to-br from-pink-200 to-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {/* 🍦 */}
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-pink-500 text-pink-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{shop.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {shop.rating}
            </span>
            <span className="text-xs text-gray-500">
              ({shop.reviews})
            </span>
          </div>
        </div>

        <p className="text-sm text-pink-600 font-medium mb-3">
          {shop.specialty}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {shop.address} • {shop.distance}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{shop.hours}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{shop.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}