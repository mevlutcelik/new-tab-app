import React, { useState } from "react";
import { getUserSettings, resetSettings } from "@/lib/storage";
import AppLayout from "@/layouts/AppLayout";
import Header from "@/layouts/Header";
import TimeDisplay from "@/components/TimeDisplay";
import { useWeather } from '@/hooks/useWeather'
import { Radio, Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { stations } from "@/lib/stations";
import { useAudio } from "@/contexts/AudioContext";

function Home({ onOpenSettings }) {
  const { selectedStation, isPlaying, togglePlay } = useAudio();
  const settings = getUserSettings();
  const weather = useWeather();
  const [query, setQuery] = useState("");
  const [stationQuery, setStationQuery] = useState("");

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

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(stationQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <Header favorites={settings?.favorites} target={settings?.openFavoritesInNewTab} onOpenSettings={onOpenSettings} weather={weather} />

      <div className="flex items-center justify-center text-center mt-12">
        <TimeDisplay showSeconds={settings?.showSeconds} />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center mt-12">
        <Tabs defaultValue="account">
          <TabsList className="flex bg-white/5 border border-white/10 h-12 mb-4">
            <TabsTrigger value="account" className="cursor-pointer data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg text-white transition-all font-semibold px-4 flex items-center justify-center gap-2">
              <Search className="size-3.5" /> Ara
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg text-white transition-all font-semibold px-4 flex items-center justify-center gap-2">
              <Radio className="size-3.5" /> Radyo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {/* 🔍 Arama Kutusu */}
            <div className="flex flex-col gap-4 items-center justify-center w-sm sm:w-md md:w-xl pb-12">
              <form onSubmit={handleSearch} className="flex flex-col items-center justify-center max-w-full w-xl relative">
                <input
                  type="text"
                  placeholder="Web'de ara..."
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  className="peer border border-white/20 px-4 h-14 w-full backdrop-blur-lg rounded-full text-white focus:text-black placeholder:text-white/50 focus:placeholder:text-black/50 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7229d9] transition-all font-medium"
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
          </TabsContent>
          <TabsContent value="password">
            <div className="flex flex-col gap-6 text-white w-sm sm:w-md md:w-xl pb-12">
              <h2 className="text-xl font-bold">Canlı Radyo</h2>
              <input
                type="text"
                placeholder="Radyo ara..."
                value={stationQuery}
                onChange={(e) => setStationQuery(e.target.value)}
                className="border border-white/20 px-4 h-14 min-h-14 w-full backdrop-blur-lg rounded-full text-white focus:text-black placeholder:text-white/50 focus:placeholder:text-black/50 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7229d9] transition-all font-medium"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {filteredStations.map((station, index) => {
                  const isActive = selectedStation?.url === station.url && isPlaying;
                  return (
                    <React.Fragment key={index}>
                      <div
                      onClick={() => togglePlay(station)}
                        className={`cursor-pointer rounded-lg p-4 border transition-all backdrop-blur-lg select-none
        ${isActive ? 'bg-green-500/30 border-green-400 scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}
      `}
                      >
                        <h3 className="text-lg font-semibold">{station.name}</h3>
                        <p className="text-sm opacity-70">{isActive ? "Çalıyor..." : "Tıklayarak dinle"}</p>
                      </div>
                      {/*<LiquidGlass
                        variant="card"
                        intensity="strong"
                        rippleEffect={false}
                        flowOnHover={false}
                        stretchOnDrag={false}
                        key={index}
                        className={`cursor-pointer rounded-lg p-4 border backdrop-blur-lg select-none !transition-all ${isActive && '!bg-green-500/30 !border-green-400 scale-105 shadow-lg'}`}
                        onClick={() => togglePlay(station)}
                      >
                        <h3 className="text-lg font-semibold">{station.name}</h3>
                        <p className="text-sm opacity-70">{isActive ? "Çalıyor..." : "Tıklayarak dinle"}</p>
                      </LiquidGlass>*/}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

export default Home;