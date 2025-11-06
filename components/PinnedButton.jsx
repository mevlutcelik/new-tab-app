import { Globe, Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

export const PinnedButton = ({ label, url, onRemove, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [imageError, setImageError] = useState(false);
  const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`;

  const handleClick = (e) => {
    // Sağ tık değilse normal link davranışı
    if (e.button === 0) {
      window.location.href = url;
    }
  };

  const handleKeyDown = (e) => {
    // Enter veya Space ile açma
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = url;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`${label} sayfasına git`}
          className="inline-flex flex-col items-center justify-center gap-2 group cursor-pointer outline-none"
        >
          <div
            className="flex flex-col items-center justify-center size-16 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-semibold rounded-full shadow-md transition-all group-hover:scale-105 group-focus:scale-105 overflow-hidden"
          >
            {!imageError ? (
              <>
                <div
                  className="size-8 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${faviconUrl})` }}
                />
                <img
                  src={faviconUrl}
                  alt=""
                  className="hidden"
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <Globe size={32} className="text-neutral-400" />
            )}
          </div>
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-focus:text-neutral-600 dark:group-focus:text-neutral-400 transition-all max-w-16 truncate">{label}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
          <ExternalLink size={16} className="mr-2" />
          Yeni Sekmede Aç
        </ContextMenuItem>
        {(!isFirst || !isLast || onEdit || onRemove) && <ContextMenuSeparator />}
        {!isFirst && onMoveUp && (
          <ContextMenuItem onClick={onMoveUp}>
            <ArrowUp size={16} className="mr-2" />
            Üste Taşı
          </ContextMenuItem>
        )}
        {!isLast && onMoveDown && (
          <ContextMenuItem onClick={onMoveDown}>
            <ArrowDown size={16} className="mr-2" />
            Alta Taşı
          </ContextMenuItem>
        )}
        {(!isFirst || !isLast) && (onEdit || onRemove) && <ContextMenuSeparator />}
        {onEdit && (
          <ContextMenuItem onClick={onEdit}>
            <Pencil size={16} className="mr-2" />
            Düzenle
          </ContextMenuItem>
        )}
        {onRemove && (
          <ContextMenuItem onClick={onRemove} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
            <Trash2 size={16} className="mr-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400" />
            Sil
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const PinnedAddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center gap-2 group focus:outline-none">
      <div
        className="flex flex-col items-center justify-center size-16 border border-dashed border-neutral-400 dark:border-neutral-500 group-hover:border-neutral-600 dark:group-hover:border-neutral-400 group-focus:border-neutral-600 dark:group-focus:border-neutral-400 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-focus:text-neutral-600 dark:group-focus:text-neutral-400 font-semibold rounded-full transition-all group-hover:scale-105 overflow-hidden group-focus:outline-none group-focus:scale-105 cursor-pointer"
      >
        <Plus size={32} className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-focus:text-neutral-600 dark:group-focus:text-neutral-400" />
      </div>
      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-focus:text-neutral-600 dark:group-focus:text-neutral-400 transition-all">Ekle</span>
    </button>
  );
};