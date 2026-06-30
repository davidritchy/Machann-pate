import { useState } from "react";
import {
  X,
  Store,
  MapPin,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { translations } from "../translations";

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shop: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    specialty: string;
    latitude?: number;
    longitude?: number;
    display_name?: string;
  }) => void;
}

export function AddShopModal({
  isOpen,
  onClose,
  onSubmit,
}: AddShopModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    specialty: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Try to resolve coordinates for the provided address
    const coords = await getCoordsFromAddress(formData.address);

    const payload = {
      ...formData,
      ...(coords
        ? {
            latitude: coords.latitude,
            longitude: coords.longitude,
            display_name: coords.display_name,
          }
        : {}),
    };

   

    if(coords !== null){

       onSubmit(payload);

    setFormData({
      name: "",
      address: "",
      phone: "",
      hours: "",
      specialty: "",
    });
    onClose();
    }
    else{
      alert("ERREUR AU NIVEAU DE L'ADRESSE!!! il se peut que l'adresse entrée ou trouvée soit inexacte...Verifiez tout le temps l'adresse et entrez l'addresse dans l'ordre indiquée!");
      return;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Remarque : les navigateurs n'autorisent pas la modification de l'en-tête `User-Agent`.
  // Si vous devez définir un User-Agent, appelez Nominatim depuis un serveur.
  const getCoordsFromAddress = async (
    adressePostale: string,
  ): Promise<
    | { latitude: number; longitude: number; display_name: string }
    | null
  > => {
    // Encodage de l'adresse pour qu'elle soit compatible avec une URL
    const adresseEncodee = encodeURIComponent(adressePostale);

    // Utiliser l'endpoint Nominatim correct
    const url = `https://nominatim.openstreetmap.org/search?q=${adresseEncodee}&format=json&limit=1`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      // Vérification si un résultat a été trouvé
      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        const nomComplet = data[0].display_name;

        console.log(`Adresse trouvée : ${nomComplet}`);
        console.log(`Latitude : ${latitude}`);
        console.log(`Longitude : ${longitude}`);

        return { latitude, longitude, display_name: nomComplet };
      } else {
        console.warn("Aucune coordonnée trouvée pour cette adresse.");
        return null;
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
      return null;
    }
  };

  // Exemple d'utilisation (à appeler depuis un handler ou useEffect)
  // getCoordsFromAddress("10 Rue de la Paix, Paris, France");


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {translations.fr.addShop}
                </h2>
                <p className="text-pink-100 text-sm">
                  {translations.fr.addShopDescription}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du Restaurant{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 " />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="La Glacerie des Délices"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent z-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="15 Rue de la République, 75001 Paris"
                required
                rows={2}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.fr.phone}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01 42 68 75 32"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.fr.hours} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="10h00 - 22h00"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.fr.specialty} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Glaces artisanales italiennes"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Ex: Gelato italien, Sorbets bio, Glaces véganes,
              etc.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📋 Note:</strong> Votre suggestion sera
              vérifiée avant d'être ajoutée à la liste publique.
              Merci de votre contribution!
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {translations.fr.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Soumettre mon restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}