// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { getUserSettings, setUserSettings, resetSettings } from "@/lib/storage";
import { isValidUrl, normalizeUrl, getFaviconUrl } from "@/utils/validators";

function Settings({ onBack }) {
  const [searchEngine, setSearchEngine] = useState("google");
  const [favorites, setFavorites] = useState([{ url: "", title: "" }]);
  const [showSeconds, setShowSeconds] = useState(false);
  const [newTab, setNewTab] = useState(true);
  const [errors, setErrors] = useState({});
  const [openFavoritesInNewTab, setOpenFavoritesInNewTab] = useState(true);

  const handleReset = () => {
      if (confirm("Tüm ayarları sıfırlamak istiyor musunuz?")) {
        resetSettings();
        window.location.reload();
      }
    };

  useEffect(() => {
    const settings = getUserSettings();
    if (settings) {
      setSearchEngine(settings.searchEngine || "google");
      setShowSeconds(settings.showSeconds || false);
      setNewTab(settings.newTab ?? true);
      const favs = settings.favorites || [];
      setFavorites(favs.map((f) => ({ url: f.url, title: f.title || "" })));
      setOpenFavoritesInNewTab(settings.openFavoritesInNewTab ?? true);
    }
  }, []);

  const handleFavoriteChange = (index, value) => {
    const updated = [...favorites];
    updated[index].url = value;
    setFavorites(updated);

    const normalized = normalizeUrl(value);
    const isValid = isValidUrl(normalized);
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
        const normalized = normalizeUrl(f.url.trim());
        if (!isValidUrl(normalized)) {
          return null;  // Geçersiz linkleri null yapıyoruz
        }
        return {
          url: normalized,
          title: f.title.trim() || new URL(normalized).hostname,
        };
      })
      .filter(Boolean); // null'ları at

    if (cleanedFavorites.length !== favorites.length) {
      alert("Bazı linkler geçersiz. Lütfen kontrol edin.");
      return;
    }

    setUserSettings({
      searchEngine,
      favorites: cleanedFavorites,
      showSeconds,
      newTab,
      openFavoritesInNewTab,
    });

    alert("Ayarlar kaydedildi!");
    onBack();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ayarları Düzenle</h1>

      {/* Arama motoru */}
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

      {/* Favori linkler */}
      <div className="mb-4">
        <label className="block font-medium">Favori Linkler</label>
        {favorites.map((fav, index) => {
          const isInvalid = errors[index];
          const normalizedUrl = normalizeUrl(fav.url);
          const showFavicon = fav.url && isValidUrl(normalizedUrl);

          return (
            <div key={index} className="mb-4 border p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                {showFavicon && (
                  <img
                    src={getFaviconUrl(normalizedUrl)}
                    alt=""
                    className="w-5 h-5"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
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
        <button
          onClick={addFavorite}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          + Link Ekle
        </button>
      </div>

      {/* Saatte saniye gösterme */}
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSeconds}
            onChange={(e) => setShowSeconds(e.target.checked)}
            className="form-checkbox"
          />
          <span>Saatte saniyeyi göster</span>
        </label>
      </div>

      {/* Yeni sekmede arama açma */}
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={newTab}
            onChange={(e) => setNewTab(e.target.checked)}
            className="form-checkbox"
          />
          <span>Arama sonucunu yeni sekmede aç</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={openFavoritesInNewTab}
            onChange={(e) => setOpenFavoritesInNewTab(e.target.checked)}
            className="form-checkbox"
          />
          <span>Favori linkleri yeni sekmede aç</span>
        </label>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-all active:scale-95 focus:outline-none select-none font-medium"
        >
          Kaydet
        </button>
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-500 transition-all active:scale-95 focus:outline-none select-none font-medium"
        >
          Geri Dön
        </button>

        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-5 h-10 text-sm rounded hover:bg-red-700 cursor-pointer transition-all active:scale-95 focus:outline-none select-none font-medium"
        >
          Ayarları Sıfırla
        </button>

      </div>
    </div>
  );
}

export default Settings;
