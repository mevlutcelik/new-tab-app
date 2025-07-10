// src/pages/Setup.jsx
import React, { useState } from "react";
import { setSetupComplete, setUserSettings } from "../lib/storage";
import { isValidUrl } from "@/utils/validators";

function Setup() {
  const [searchEngine, setSearchEngine] = useState("google");
  const [favorites, setFavorites] = useState([""]);

  const handleFavoriteChange = (index, value) => {
    const updated = [...favorites];
    updated[index] = value;
    setFavorites(updated);
  };

  const addFavorite = () => setFavorites([...favorites, ""]);

  const removeFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const cleanedFavorites = favorites
      .map((f) => f.trim())
      .filter((f) => f !== "" && isValidUrl(f));

    if (cleanedFavorites.length !== favorites.filter(f => f.trim() !== "").length) {
      alert("Geçersiz linkler var. Lütfen http:// veya https:// ile başlayan geçerli linkler girin.");
      return;
    }

    setUserSettings({ searchEngine, favorites: cleanedFavorites });
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
        {favorites.map((link, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={link}
              placeholder="https://örnek.com"
              onChange={(e) => handleFavoriteChange(index, e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => removeFavorite(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Sil
            </button>
          </div>
        ))}

        <button onClick={addFavorite} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
          + Link Ekle
        </button>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Kaydet ve Devam Et
      </button>
    </div>
  );
}

export default Setup;
