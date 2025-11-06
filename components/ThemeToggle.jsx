import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex group items-center justify-center size-12 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
      title={isDark ? "Açık Moda Geç" : "Koyu Moda Geç"}
      aria-label={isDark ? "Açık Moda Geç" : "Koyu Moda Geç"}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500 group-hover:scale-120 transition-transform" />
      ) : (
        <Moon size={20} className="text-neutral-700 group-hover:scale-120 transition-transform" />
      )}
    </button>
  );
};
