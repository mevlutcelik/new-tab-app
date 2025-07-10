import { useState } from "react";
import Setup from "@/pages/Setup";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import AppLayout from "@/layouts/AppLayout";
import Header from "@/layouts/Header";
import { isSetupComplete } from "@/lib/storage";

function App() {
  const [view, setView] = useState(isSetupComplete() ? "home" : "setup");

  if (view === "setup") return <Setup />;
  if (view === "settings") return <Settings onBack={() => setView("home")} />;
  if (view === "home") return <Home onOpenSettings={() => setView("settings")} />;
}

const Home2 = () => {
  return (
    <AppLayout>
      <Header />
    </AppLayout>
  );
};

export default App;