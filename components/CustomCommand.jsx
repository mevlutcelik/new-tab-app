import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useMediaQuery } from "react-responsive";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Home, Boxes, Award, Github, Linkedin, Bookmark as BookmarkIcon, Search, Loader2, AlertCircle, Globe } from "lucide-react";

export default function CustomCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [bookmarkItems, setBookmarkItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faviconErrors, setFaviconErrors] = useState(new Set());
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const listRef = useRef(null);
  const abortControllerRef = useRef(null);

  // const items = [
  //   { id: 1, title: "Anasayfa", url: "/", icon: <Home size={18} /> },
  //   { id: 2, title: "Projeler", url: "/projects", icon: <Boxes size={18} /> },
  //   { id: 3, title: "Sertifikalar", url: "/certificates", icon: <Award size={18} /> },
  //   { id: 4, title: "GitHub", url: "https://github.com/mevlutcelik", icon: <Github size={18} />, external: true },
  //   { id: 5, title: "LinkedIn", url: "https://www.linkedin.com/in/mevlutcelik", icon: <Linkedin size={18} />, external: true },
  // ];

  const items = [];

  // Kısayol: Ctrl+K veya /
  useEffect(() => {
    const handler = (e) => {
      // Eğer input, textarea veya contenteditable içinde yazıyorsak, kısayolu tetikleme
      const target = e.target;
      const isEditing = target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (!open && !isEditing && (((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) || e.key === "/")) {
        e.preventDefault();
        setQuery("");
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Fetch history & bookmarks with error handling and cancellation
  useEffect(() => {
    if (!open) {
      setHistoryItems([]);
      setBookmarkItems([]);
      setError(null);
      setFaviconErrors(new Set());
      return;
    }

    // Check if Chrome APIs are available
    if (!chrome?.history || !chrome?.bookmarks) {
      setError("Chrome API'leri kullanılamıyor. Bu uygulama Chrome/Edge uzantısı olarak çalışmalıdır.");
      return;
    }

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    const fetchData = async () => {
      try {
        // Fetch history
        chrome.history.search({ text: "", maxResults: 100, startTime: 0 }, (res) => {
          if (chrome.runtime.lastError) {
            console.error("History fetch error:", chrome.runtime.lastError);
            setError("Geçmiş yüklenirken hata oluştu.");
            setIsLoading(false);
            return;
          }

          if (abortControllerRef.current?.signal.aborted) return;

          const h = (res || []).map(hItem => ({
            id: "h-" + hItem.id,
            title: hItem.title + " - " + hItem.url || hItem.title || hItem.url || "İsimsiz",
            url: hItem.url,
            faviconUrl: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(hItem.url)}&size=256`,
            type: "history"
          }));
          setHistoryItems(h);
        });

        // Fetch bookmarks
        chrome.bookmarks.getTree((bTree) => {
          if (chrome.runtime.lastError) {
            console.error("Bookmarks fetch error:", chrome.runtime.lastError);
            setError("Yer işaretleri yüklenirken hata oluştu.");
            setIsLoading(false);
            return;
          }

          if (abortControllerRef.current?.signal.aborted) return;

          const flattenBookmarks = (nodes) => {
            let arr = [];
            nodes.forEach(node => {
              if (node.url) arr.push({
                id: "b-" + node.id,
                title: node.title || node.url || "İsimsiz",
                url: node.url,
                faviconUrl: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(node.url)}&size=256`,
                type: "bookmark"
              });
              if (node.children) arr = arr.concat(flattenBookmarks(node.children));
            });
            return arr;
          };
          setBookmarkItems(flattenBookmarks(bTree));
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Veri yüklenirken beklenmeyen bir hata oluştu.");
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup: Cancel ongoing requests when component unmounts or dialog closes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [open]);

  // Scroll reset: query değişince en üste al (filteredItems bağımlılık döngüsünü düzelt)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [query]);

  const handleClick = useCallback((item) => {
    try {
      if (item.external || item.url?.startsWith('http')) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = item.url;
      }
    } catch (err) {
      console.error("Navigation error:", err);
      // Fallback: try opening in new tab
      window.open(item.url, "_blank", "noopener,noreferrer");
    } finally {
      setOpen(false);
    }
  }, []);

  const handleFaviconError = useCallback((itemId) => {
    setFaviconErrors(prev => new Set([...prev, itemId]));
  }, []);

  const renderIcon = useCallback((item) => {
    // Eğer item'da icon varsa (static items), direkt onu göster
    if (item.icon) {
      return item.icon;
    }

    // Bookmark için bookmark icon
    if (item.type === "bookmark") {
      return <BookmarkIcon size={16} className="text-blue-500 dark:text-blue-400" />;
    }

    // History için favicon veya fallback
    if (item.faviconUrl && !faviconErrors.has(item.id)) {
      return (
        <div className="relative w-4 h-4 shrink-0">
          <div
            className="w-full h-full rounded-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${item.faviconUrl})` }}
          />
          <img
            src={item.faviconUrl}
            alt=""
            className="hidden"
            onError={() => handleFaviconError(item.id)}
          />
        </div>
      );
    }

    // Fallback icon
    return <Globe size={16} className="text-neutral-400" />;
  }, [faviconErrors, handleFaviconError]);

  const isValidUrl = useCallback((str) => {
    if (!str) return false;

    // Eğer boşluk varsa kesinlikle URL değil, arama sorgusu
    if (str.includes(' ')) return false;

    // http:// veya https:// ile başlıyorsa URL
    if (str.startsWith('http://') || str.startsWith('https://')) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    }

    // www. ile başlıyorsa URL
    if (str.startsWith('www.')) {
      try {
        new URL(`https://${str}`);
        return true;
      } catch {
        return false;
      }
    }

    // domain.com veya domain.com.tr formatında olmalı
    // İki parçalı TLD'leri de destekler: .com.tr, .co.uk, .gov.au vb.
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\?#].*)?$/;
    if (domainPattern.test(str)) {
      try {
        new URL(`https://${str}`);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }, []);

  const googleSearchUrl = useCallback((q) =>
    `https://www.google.com/search?q=${encodeURIComponent(q)}`, []
  );

  // Fuse instance memoization - performance optimization
  const allItems = useMemo(() => {
    const combined = [...items, ...historyItems, ...bookmarkItems];

    // Remove duplicates based on URL and regenerate unique IDs
    const uniqueMap = new Map();
    combined.forEach(item => {
      if (!uniqueMap.has(item.url)) {
        uniqueMap.set(item.url, item);
      }
    });

    const uniqueItems = Array.from(uniqueMap.values()).map((item, index) => ({
      ...item,
      uniqueId: `item-${index}-${item.url}` // Ensure truly unique ID for React key
    }));

    return uniqueItems;
  }, [items, historyItems, bookmarkItems]);

  const fuse = useMemo(() => {
    return new Fuse(allItems, {
      keys: ["title", "url"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  }, [allItems]);

  // Fuse filter with memoized fuse instance
  const filteredItems = useMemo(() => {
    // Eğer query boşsa tüm sonuçları göster
    if (!query.trim()) {
      return allItems;
    }

    // Query varsa Fuse ile ara
    const results = fuse.search(query.trim());
    const items = results.map(r => r.item);

    // Additional deduplication by title AND URL
    // If same title, keep only the first one
    const uniqueMap = new Map();
    items.forEach(item => {
      // Use title as primary key for deduplication (not URL)
      // Because same title with different URL params should still be treated as duplicate
      const key = item.title.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    const uniqueItems = Array.from(uniqueMap.values());
    return uniqueItems;
  }, [query, fuse, allItems]);

  // Handle search submission (Google/URL navigation)
  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    try {
      if (isValidUrl(trimmedQuery)) {
        const url = trimmedQuery.startsWith('http') ? trimmedQuery : `https://${trimmedQuery}`;
        window.location.href = url;
      } else {
        window.open(googleSearchUrl(trimmedQuery), "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setOpen(false);
    }
  }, [query, isValidUrl, googleSearchUrl]);

  return (
    <>
      <div
        tabIndex={0}
        role="button"
        className="flex items-center justify-between h-12 rounded-xl w-full p-4 max-w-xl bg-white dark:bg-neutral-800 border cursor-text shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setQuery("");
            setOpen(true);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <Search size={16} className="text-neutral-400 dark:text-neutral-500" />
          <span className="text-neutral-400 dark:text-neutral-500">Ara veya url gir...</span>
        </div>
        <KbdGroup>
          <Kbd className="bg-neutral-50 dark:bg-neutral-700 border text-neutral-400 dark:text-neutral-500">/</Kbd>
          <small className="text-neutral-600 dark:text-neutral-500 text-xs">veya</small>
          <Kbd className="bg-neutral-50 dark:bg-neutral-700 border text-neutral-400 dark:text-neutral-500">CTRL</Kbd> <span className="text-neutral-600 dark:text-neutral-500 text-xs">+</span> <Kbd className="bg-neutral-50 dark:bg-neutral-700 border text-neutral-400 dark:text-neutral-500">K</Kbd>
        </KbdGroup>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Ara veya url gir..."
          value={query}
          onValueChange={setQuery}
          autoFocus
        />
        <CommandList ref={listRef}>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-neutral-600">Yükleniyor...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 py-4 px-3 text-sm text-red-600 bg-red-50 rounded-md m-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Google search veya URL - Her zaman query varsa göster */}
          {!isLoading && !error && query.trim() && (
            <CommandGroup heading="Web Araması">
              <CommandItem
                onSelect={handleSearch}
                className="cursor-pointer"
              >
                <Search size={18} className="shrink-0" />
                <span className="ml-2 truncate">
                  {isValidUrl(query.trim())
                    ? `URL'e git: ${query.trim()}`
                    : `Google'da ara: ${query.trim()}`}
                </span>
              </CommandItem>
            </CommandGroup>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <CommandGroup heading="Sonuçlar">
              {filteredItems.map(item => (
                <CommandItem key={item.uniqueId || item.id} onSelect={() => handleClick(item)}>
                  {renderIcon(item)}
                  <span className="ml-2 line-clamp-1">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
