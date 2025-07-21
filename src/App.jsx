import { useState } from "react";
import Setup from "@/pages/Setup";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import { isSetupComplete } from "@/lib/storage";
import { AudioProvider } from "@/contexts/AudioContext";

function App() {
  const [view, setView] = useState(isSetupComplete() ? "home" : "setup");

  return (
    <AudioProvider>
      {view === "setup" && <Setup />}
      {view === "settings" && <Settings onBack={() => setView("home")} />}
      {view === "home" && (
        <Home onOpenSettings={() => setView("settings")} />
      )}
    </AudioProvider>
  );
}

export default App;
