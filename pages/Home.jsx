import { useState } from "react";
import { getUserSettings, resetSettings } from "@/lib/storage";
import { getFaviconUrl } from "@/utils/validators";
import AppLayout from "@/layouts/AppLayout";
import Header from "@/layouts/Header";
import TimeDisplay from "@/components/TimeDisplay";
import { useWeather } from '@/hooks/useWeather'
import { Search } from "lucide-react";

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
  const weather = useWeather();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const url = getSearchUrl(settings?.searchEngine, query);
      if (settings?.newTab) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
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
    <AppLayout>
      <Header favorites={settings?.favorites} target={settings?.openFavoritesInNewTab} onOpenSettings={onOpenSettings} weather={weather} />

      {/* Tabs */}


      <div className="flex items-center justify-center text-center mt-12">
        <TimeDisplay showSeconds={settings?.showSeconds} />
      </div>

      {/* 🔍 Arama Kutusu */}
      <div className="flex flex-col gap-4 items-center justify-center mt-12">
        <form onSubmit={handleSearch} className="flex flex-col items-center justify-center max-w-full w-xl relative">
          <input
            type="text"
            placeholder="Web'de ara..."
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            className="peer border border-white/20 px-4 h-14 w-full backdrop-blur-lg rounded-full text-black placeholder:text-white/50 focus:placeholder:text-black/50 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7229d9] transition-all font-medium"
          />
          <button
            type="submit"
            className="z-10 absolute right-1.5 top-1/2 -mt-5.5 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center cursor-pointer active:scale-90 transition-transform focus:outline-none peer-focus:bg-[#7229d9] peer-focus:text-white"
          >
            <Search className="size-4" />
          </button>
        </form>
        <p className="text-white/80 text-sm">
          Seçilen Arama Motoru: <strong className="text-white">{settings?.searchEngine?.charAt(0).toUpperCase() + settings?.searchEngine?.slice(1)}</strong>
        </p>
      </div>

      {/* ⚙️ Ayar butonları */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={onOpenSettings}
          className="bg-white/5 text-white px-5 border border-white/10 h-10 text-sm rounded-lg hover:bg-white/10 backdrop-blur-lg cursor-pointer transition-all active:scale-95 focus:outline-none select-none font-medium"
        >
          Ayarları Düzenle
        </button>
        <button
          onClick={handleReset}
          className="bg-white/5 text-white px-5 border border-white/10 h-10 text-sm rounded-lg hover:bg-white/10 backdrop-blur-lg cursor-pointer transition-all active:scale-95 focus:outline-none select-none font-medium"
        >
          Ayarları Sıfırla
        </button>
      </div>
    </AppLayout>
  );
}

export default Home;