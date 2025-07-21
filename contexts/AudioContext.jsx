import { createContext, useContext, useEffect, useRef, useState } from "react";

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Yayını başlat / durdur
  const togglePlay = (station) => {
    const audio = audioRef.current;
    if (!audio) return;

    const sameStation = selectedStation?.url === station?.url;

    if (sameStation) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    } else {
      setSelectedStation(station);
    }
  };

  // İstasyon değiştiğinde otomatik çal
  useEffect(() => {
    const audio = audioRef.current;
    if (!selectedStation?.url || !audio) return;

    audio.src = selectedStation.url;
    audio.load();
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [selectedStation]);

  // Yayın hatası durumunda yeniden bağlan
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      console.warn("Radyo yayını koptu. Tekrar bağlanılıyor...");
      setIsPlaying(false);

      if (selectedStation?.url) {
        const newSrc = `${selectedStation.url}?t=${Date.now()}`;
        audio.src = newSrc;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleError);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleError);
    };
  }, [selectedStation]);

  return (
    <AudioContext.Provider
      value={{
        selectedStation,
        isPlaying,
        togglePlay,
      }}
    >
      {children}
      <audio ref={audioRef} style={{ display: "none" }} />
    </AudioContext.Provider>
  );
}

// Custom hook
export const useAudio = () => useContext(AudioContext);
