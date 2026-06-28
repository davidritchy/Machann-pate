import { Heart, ArrowLeft } from "lucide-react";
import { IceCreamShopCard } from "./IceCreamShopCard";
import { translations } from "../translations";

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

interface FavoritesViewProps {
  favorites: IceCreamShop[];
  onBack: () => void;
  onShopClick: (shop: IceCreamShop) => void;
  onToggleFavorite?: (shopId: number) => void;
}

export function FavoritesView({
  favorites,
  onBack,
  onShopClick,
  onToggleFavorite,
}: FavoritesViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{translations.fr.back}</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-12 h-12 fill-pink-500 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {translations.fr.myFavoritesTitle}
            </h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} restaurant
            {favorites.length > 1 ? "s" : ""} dans vos favoris
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <Heart className="w-24 h-24 text-gray-300 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {translations.fr.noFavorites}
            </h2>
            <p className="text-gray-500 mb-6">
              {translations.fr.noFavoritesMessage}
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              {translations.fr.addShop}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((shop) => (
              <IceCreamShopCard
                key={shop.id}
                shop={shop}
                onClick={() => onShopClick(shop)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}