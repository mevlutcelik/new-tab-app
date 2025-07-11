// src/pages/Setup.jsx
import React, { useState } from "react";
import { setSetupComplete, setUserSettings } from "../lib/storage";
import { isValidUrl, normalizeUrl, getFaviconUrl } from "@/utils/validators";

function Setup() {
  const [searchEngine, setSearchEngine] = useState("google");
  const [favorites, setFavorites] = useState([{ url: "", title: "" }]);
  const [showSeconds, setShowSeconds] = useState(false);
  const [newTab, setNewTab] = useState(true);
  const [errors, setErrors] = useState({});
  const [openFavoritesInNewTab, setOpenFavoritesInNewTab] = useState(true);

  const handleFavoriteUrlChange = (index, value) => {
    const updated = [...favorites];
    updated[index].url = value;
    setFavorites(updated);

    const normalized = normalizeUrl(value);
    const isValid = isValidUrl(normalized);
    setErrors((prev) => ({ ...prev, [index]: !isValid }));
  };

  const handleFavoriteTitleChange = (index, value) => {
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

  const handleSubmit = () => {
    const cleanedFavorites = favorites
      .map((f) => {
        const normalized = normalizeUrl(f.url.trim());
        return {
          url: normalized,
          title: f.title.trim() || new URL(normalized).hostname,
        };
      })
      .filter((f) => f.url && isValidUrl(f.url));

    if (cleanedFavorites.length !== favorites.filter(f => f.url.trim() !== "").length) {
      alert("Geçersiz linkler var. Lütfen kontrol edin.");
      return;
    }

    setUserSettings({ searchEngine, favorites: cleanedFavorites, showSeconds, newTab, openFavoritesInNewTab });
    setSetupComplete();
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kurulum</h1>

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
          const normalizedUrl = normalizeUrl(fav.url);
          const isInvalid = errors[index];
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
                  onChange={(e) => handleFavoriteUrlChange(index, e.target.value)}
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
                onChange={(e) => handleFavoriteTitleChange(index, e.target.value)}
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

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Kaydet ve Devam Et
      </button>
    </div>
  );
}

export default Setup;
