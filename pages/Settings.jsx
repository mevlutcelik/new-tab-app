import React, { useState, useEffect } from "react";
import { getUserSettings, setUserSettings } from "../lib/storage";
import { isValidUrl, normalizeUrl, getFaviconUrl } from "../utils/validators";

function Settings({ onBack }) {
  const [searchEngine, setSearchEngine] = useState("google");
  const [favorites, setFavorites] = useState([{ url: "", title: "" }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const settings = getUserSettings();
    if (settings) {
      setSearchEngine(settings.searchEngine || "google");
      const favs = settings.favorites || [];
      setFavorites(favs.map((f) => ({ url: f.url, title: f.title || "" })));
    }
  }, []);

  const handleFavoriteChange = (index, value) => {
    const updated = [...favorites];
    updated[index].url = value;
    setFavorites(updated);
    const isValid = isValidUrl(normalizeUrl(value));
    setErrors((prev) => ({ ...prev, [index]: !isValid }));
  };

  const handleTitleChange = (index, value) => {
    const updated = [...favorites];
    updated[index].title = value;
    setFavorites(updated);
  };

  const addFavorite = () => {
    setFavorites([...favorites, { url: "", title: "" }]);
  };

  const removeFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const cleanedFavorites = favorites
      .map((f) => {
        const url = normalizeUrl(f.url.trim());
        return {
          url,
          title: f.title.trim() || new URL(url).hostname,
        };
      })
      .filter((f) => f.url && isValidUrl(f.url));

    if (cleanedFavorites.length !== favorites.length) {
      alert("Bazı linkler geçersiz. Lütfen kontrol edin.");
      return;
    }

    setUserSettings({ searchEngine, favorites: cleanedFavorites });
    alert("Ayarlar kaydedildi!");
    onBack();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ayarları Düzenle</h1>

      <div className="mb-4">
        <label className="block font-medium">Arama Motoru</label>
        <select
          className="border p-2 rounded"
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value)}
        >
          <option value="google">Google</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="bing">Bing</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Favori Linkler</label>
        {favorites.map((fav, index) => {
          const isInvalid = errors[index];
          return (
            <div key={index} className="mb-4 border p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={getFaviconUrl(fav.url)}
                  alt=""
                  className="w-5 h-5"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <input
                  type="text"
                  value={fav.url}
                  placeholder="https://site.com"
                  onChange={(e) => handleFavoriteChange(index, e.target.value)}
                  className={`border p-2 rounded w-full ${isInvalid ? "border-red-500" : ""}`}
                />
                <button
                  onClick={() => removeFavorite(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Sil
                </button>
              </div>
              <input
                type="text"
                value={fav.title}
                placeholder="Başlık (opsiyonel)"
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          );
        })}
        <button onClick={addFavorite} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
          + Link Ekle
        </button>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
        <button onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">
          Geri Dön
        </button>
      </div>
    </div>
  );
}

export default Settings;
