import { Music } from "lucide-react";

export const MusicCard = () => {

    return (
        <div className="sm:col-span-1 flex flex-col justify-center gap-4 rounded-3xl w-full p-4 mx-auto bg-white dark:bg-neutral-800 border cursor-text shadow-md transition-colors">
            <div className="flex items-center gap-1">
                <Music size={16} className="text-neutral-500 dark:text-neutral-400 mb-0.5" />
                <span className="ml-2 text-sm font-light text-neutral-500 dark:text-neutral-400 tracking-tighter">MÜZİK DİNLE</span>
            </div>
            <iframe
                className="bg-neutral-50 dark:bg-neutral-800 border rounded-2xl h-52"
                src={`https://mehasoft.com.tr/newtab/music-player.php?theme=${document.documentElement.classList.contains('dark') ? 'dark' : 'light'}`}
                width="100%"
                height="208"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </div>
    );
};