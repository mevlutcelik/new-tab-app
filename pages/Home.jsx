// src/pages/Home.jsx
import { useState } from "react";
import { getUserSettings, resetSettings } from "@/lib/storage";
import { getFaviconUrl } from "@/utils/validators";

function getSearchUrl(engine, query) {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case "google":
      return `https://www.google.com/search?q=${encoded}`;
    case "duckduckgo":
      return `https://duckduckgo.com/?q=${encoded}`;
    case "bing":
      return `https://www.bing.com/search?q=${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}`;
  }
}

function Home({ onOpenSettings }) {
  const settings = getUserSettings();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const url = getSearchUrl(settings?.searchEngine, query);
      window.open(url, "_blank");
      setQuery("");
    }
  };

  const handleReset = () => {
    if (confirm("Tüm ayarları sıfırlamak istiyor musunuz?")) {
      resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hoş Geldin 👋</h1>

      {/* Arama kutusu */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Web'de ara..."
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-3/4"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ara
        </button>
      </form>

      <p>Seçilen Arama Motoru: {settings?.searchEngine}</p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Favori Linkler</h2>
        <ul className="list-disc pl-4">
          {settings?.favorites?.map((fav, index) => (
            <li key={index} className="flex items-center gap-2 mb-2">
              <img
                src={getFaviconUrl(fav.url)}
                alt=""
                className="w-5 h-5"
                onError={(e) => (e.target.style.display = "none")}
              />
              <a
                href={fav.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {fav.title || fav.url}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onOpenSettings}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Ayarları Düzenle
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Ayarları Sıfırla
        </button>
      </div>
    </div>
  );
}

export default Home;
