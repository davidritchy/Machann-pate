import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  LogIn,
  Plus,
} from "lucide-react";
import { IceCreamShopCard } from "./components/IceCreamShopCard";
import { ShopDetailsModal } from "./components/ShopDetailsModal";
import { AuthModal } from "./components/AuthModal";
import { UserMenu } from "./components/UserMenu";
import { AddShopModal } from "./components/AddShopModal";
import { FavoritesView } from "./components/FavoritesView";
import { ChatRoom } from "./components/ChatRoom";
import { SettingsModal } from "./components/SettingsModal";
import { translations, Language } from "./translations";
import logo_pate from "../img/logo_pate.webp";

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
  latitude?: number;
  longitude?: number;
  display_name?: string;
}

interface Review {
  id: number;
  shopId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

const initialShops: IceCreamShop[] = [
  {
    id: 1,
    name: "La Glacerie Artisanale",
    address: "15 Rue de la Paix, 75002 Paris",
    distance: "0.5 km",
    rating: 4.8,
    reviews: 342,
    hours: "10h00 - 22h00",
    phone: "01 42 68 75 32",
    specialty: "Glaces artisanales françaises",
    image: "/api/placeholder/400/300",
  },
  {
    id: 2,
    name: "Gelato Amore",
    address: "28 Boulevard Saint-Germain, 75005 Paris",
    distance: "1.2 km",
    rating: 4.9,
    reviews: 521,
    hours: "11h00 - 23h00",
    phone: "01 43 26 48 92",
    specialty: "Gelato italien authentique",
    image: "/api/placeholder/400/300",
  },
  {
    id: 3,
    name: "Sorbet & Co",
    address: "42 Avenue des Champs-Élysées, 75008 Paris",
    distance: "2.1 km",
    rating: 4.6,
    reviews: 287,
    hours: "09h00 - 21h00",
    phone: "01 45 62 33 18",
    specialty: "Sorbets fruités et bio",
    image: "/api/placeholder/400/300",
  },
  {
    id: 4,
    name: "Cremeria Venezia",
    address: "8 Rue du Faubourg Montmartre, 75009 Paris",
    distance: "0.8 km",
    rating: 4.7,
    reviews: 419,
    hours: "10h30 - 22h30",
    phone: "01 48 78 92 15",
    specialty: "Glaces vénitiennes traditionnelles",
    image: "/api/placeholder/400/300",
  },
  {
    id: 5,
    name: "Le Glacier Moderne",
    address: "53 Rue de Rivoli, 75004 Paris",
    distance: "1.5 km",
    rating: 4.5,
    reviews: 198,
    hours: "10h00 - 20h00",
    phone: "01 42 77 54 21",
    specialty: "Parfums originaux et créatifs",
    image: "/api/placeholder/400/300",
  },
  {
    id: 6,
    name: "Dolce Vita",
    address: "19 Rue Mouffetard, 75005 Paris",
    distance: "2.8 km",
    rating: 4.9,
    reviews: 634,
    hours: "11h00 - 23h30",
    phone: "01 43 31 68 47",
    specialty: "Gelato artisanal italien",
    image: "/api/placeholder/400/300",
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] =
    useState<IceCreamShop | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "rating">(
    "distance",
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddShopModalOpen, setIsAddShopModalOpen] =
    useState(false);
  const [user, setUser] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [shops, setShops] =
    useState<IceCreamShop[]>(initialShops);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("fr");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ipLocation, setIpLocation] = useState<{
    country: string;
    city: string;
  } | null>(null);
  const [shopReviews, setShopReviews] = useState<Review[]>([
    {
      id: 1,
      shopId: 1,
      userId: "user1@email.com",
      userName: "Sophie L.",
      rating: 5,
      comment:
        "Excellentes glaces artisanales! Le parfum pistache est incroyable.",
      date: new Date(Date.now() - 86400000 * 3),
    },
    {
      id: 2,
      shopId: 2,
      userId: "user2@email.com",
      userName: "Marc D.",
      rating: 5,
      comment:
        "Le meilleur gelato de Montréal sans hésitation. Authentique et délicieux!",
      date: new Date(Date.now() - 86400000 * 5),
    },
    {
      id: 3,
      shopId: 2,
      userId: "user3@email.com",
      userName: "Emma R.",
      rating: 4,
      comment:
        "Très bon mais un peu cher. La qualité est au rendez-vous cependant.",
      date: new Date(Date.now() - 86400000 * 2),
    },
  ]);

  const t = translations[language];

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddShop = (shopData: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    specialty: string;
    latitude?: number;
    longitude?: number;
    display_name?: string;
  }) => {
    const newShop: IceCreamShop = {
      id: shops.length + 1,
      name: shopData.name,
      address: shopData.address,
      phone: shopData.phone,
      hours: shopData.hours,
      specialty: shopData.specialty,
      distance: "En attente de vérification",
      rating: 0,
      reviews: 0,
      image: "/api/placeholder/400/300",
      latitude: shopData.latitude,
      longitude: shopData.longitude,
      display_name: shopData.display_name,
    };

    setShops([...shops, newShop]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const toggleFavorite = (shopId: number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setFavorites((prev) =>
      prev.includes(shopId)
        ? prev.filter((id) => id !== shopId)
        : [...prev, shopId],
    );
  };

  const handleAddReview = (
    shopId: number,
    rating: number,
    comment: string,
  ) => {
    if (!user) return;

    const newReview: Review = {
      id: shopReviews.length + 1,
      shopId,
      userId: user.email,
      userName: user.name,
      rating,
      comment,
      date: new Date(),
    };

    setShopReviews([...shopReviews, newReview]);

    // Update shop rating
    const shopReviewsList = [...shopReviews, newReview].filter(
      (r) => r.shopId === shopId,
    );
    const avgRating =
      shopReviewsList.reduce((acc, r) => acc + r.rating, 0) /
      shopReviewsList.length;

    setShops(
      shops.map((shop) =>
        shop.id === shopId
          ? {
              ...shop,
              rating: Math.round(avgRating * 10) / 10,
              reviews: shopReviewsList.length,
            }
          : shop,
      ),
    );
  };

  const favoriteShops = shops.filter((shop) =>
    favorites.includes(shop.id),
  );

  const filteredShops = shops
    .filter(
      (shop) =>
        shop.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shop.address
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shop.specialty
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return parseFloat(a.distance) - parseFloat(b.distance);
    });




  const getIpLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      setIpLocation({
        country: data.country_name,
        city: data.city,
      });

      console.log("Country:", data.country_name);
      console.log("City:", data.city);
      console.log("Region:", data.region);
      console.log("Latitude:", data.latitude);
      console.log("Longitude:", data.longitude);
    } catch (error) {
      console.error("Could not get location:", error);
    }
  };

  useEffect(() => {
    getIpLocation();
  }, []);

  if (showFavorites) {
    return (
      <>
        <FavoritesView
          favorites={favoriteShops}
          onBack={() => setShowFavorites(false)}
          onShopClick={setSelectedShop}
          onToggleFavorite={toggleFavorite}
        />
        <ShopDetailsModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          reviews={shopReviews}
          currentUser={user}
          onAddReview={handleAddReview}
          language={language}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddShopModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow font-medium"
          >
            <Plus className="w-5 h-5" />
            {t.addShop}
          </button>

          {user ? (
            <UserMenu
              userName={user.name}
              onLogout={handleLogout}
              onViewFavorites={() => setShowFavorites(true)}
              onOpenChat={() => setIsChatOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              favoritesCount={favorites.length}
              language={language}
            />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow font-medium text-gray-700"
            >
              <LogIn className="w-5 h-5" />
              {t.login}
            </button>
          )}
        </div>

        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="text-xl">✅</span>
            <p>
              <strong>{t.thankYou}</strong>{" "}
              {t.submissionSuccess}
            </p>
          </div>
        )}

        <div className="text-center mb-8 ">
          <div className="flex items-center justify-center gap-3 mb-3 ">
            {/* <span className="text-6xl">🍨</span> */}
            <img src={logo_pate} alt="logo pate" className="w-56 h-40 ps-0  rounded-lg "  />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent -m-1  pl-0 py-2 absolute top-64">
              {t.title}
            </h1>
          </div>
          <p className="text-gray-600 top-8 relative">{t.subtitle}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>



          <div className="flex items-center gap-4 justify-between bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-gray-700">
                {ipLocation
                  ? `${ipLocation.city}, ${ipLocation.country}`
                  : "Port-au-Prince, Haïti"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "distance" | "rating",
                  )
                }
                className="bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="distance">
                  {t.sortByDistance}
                </option>
                <option value="rating">{t.sortByRating}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredShops.length}
            </span>{" "}
            {filteredShops.length > 1
              ? t.shopsFoundPlural
              : t.shopsFound}{" "}
            {filteredShops.length > 1 ? t.foundPlural : t.found}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <IceCreamShopCard
              key={shop.id}
              shop={shop}
              onClick={() => setSelectedShop(shop)}
              isFavorite={favorites.includes(shop.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-gray-600">{t.noResults}</p>
          </div>
        )}
      </div>

      <ShopDetailsModal
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
        reviews={shopReviews}
        currentUser={user}
        onAddReview={handleAddReview}
        language={language}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <AddShopModal
        isOpen={isAddShopModalOpen}
        onClose={() => setIsAddShopModalOpen(false)}
        onSubmit={handleAddShop}
      />

      <ChatRoom
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={user}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    </div>
  );
}