import { useState, useRef } from "react";
import Setup from "@/pages/Setup";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import { isSetupComplete } from "@/lib/storage";

function App() {
  const [view, setView] = useState(isSetupComplete() ? "home" : "setup");

  // 🎧 Radyo çalar state & ref
  const [selectedStation, setSelectedStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 🎵 Oynat / Durdur işlevi
  const handlePlayToggle = (station) => {
    if (selectedStation?.url === station.url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setSelectedStation(station);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current.play().catch(() => {});
      }, 0);
    }
  };

  // 🧭 Sayfa yönetimi
  if (view === "setup") return <Setup />;
  if (view === "settings") {
    return (
      <>
        <Settings onBack={() => setView("home")} />
        {/* 🎧 Audio çalar burada da aktif kalır */}
        <audio ref={audioRef} src={selectedStation?.url || ""} style={{ display: "none" }} />
      </>
    );
  }

  if (view === "home") {
    return (
      <>
        <Home
          onOpenSettings={() => setView("settings")}
          selectedStation={selectedStation}
          isPlaying={isPlaying}
          onTogglePlay={handlePlayToggle}
        />
        <audio ref={audioRef} src={selectedStation?.url || ""} style={{ display: "none" }} />
      </>
    );
  }
}

export default App;