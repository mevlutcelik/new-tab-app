import { Music } from "lucide-react";

export const MusicCard = () => {

    return (
        <div className="sm:col-span-1 flex flex-col justify-center gap-4 rounded-3xl w-full p-4 mx-auto bg-white border cursor-text shadow-md">
            <div className="flex items-center gap-1">
                <Music size={16} className="text-neutral-500 mb-0.5" />
                <span className="ml-2 text-sm font-light text-neutral-500 tracking-tighter">MÜZİK DİNLE</span>
            </div>
            <iframe
                className="bg-neutral-50 border rounded-2xl h-52"
                src="https://mehasoft.com.tr/newtab/music-player.php"
                width="100%"
                height="208"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </div>
    );
};