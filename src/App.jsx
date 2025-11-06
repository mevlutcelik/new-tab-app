import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomCommand from "@/components/CustomCommand";
import { MehasoftAi } from "@/components/MehasoftAi";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PinnedButton } from "@/components/PinnedButton";
import { PinnedAddButton } from "../components/PinnedButton";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TodoCard } from "../components/cards/Todo";
import { CalendarCard } from "../components/cards/Calendar";
import { TranslateCard } from "../components/cards/Translate";
import { MusicCard } from "../components/cards/Music";

const MAX_PINNED_ITEMS = 9;
const STORAGE_KEY = "pinnedButtons";

const defaultPinnedItems = [
  { id: 1, label: "YouTube", url: "https://www.youtube.com" },
  { id: 2, label: "ChatGPT", url: "https://chatgpt.com" },
];

function App() {
  const [pinnedItems, setPinnedItems] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  // Load pinned items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPinnedItems(JSON.parse(stored));
      } else {
        // İlk açılışta default items'ı kaydet
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPinnedItems));
        setPinnedItems(defaultPinnedItems);
      }
    } catch (error) {
      console.error("Error loading pinned items:", error);
      setPinnedItems(defaultPinnedItems);
    }
  }, []);

  // Save pinned items to localStorage whenever they change
  const savePinnedItems = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setPinnedItems(items);
    } catch (error) {
      console.error("Error saving pinned items:", error);
    }
  };

  const handleAddItem = () => {
    if (!newItemLabel.trim() || !newItemUrl.trim()) return;
    if (pinnedItems.length >= MAX_PINNED_ITEMS) return;

    const newItem = {
      id: Date.now(),
      label: newItemLabel.trim(),
      url: newItemUrl.trim().startsWith("http") ? newItemUrl.trim() : `https://${newItemUrl.trim()}`,
    };

    savePinnedItems([...pinnedItems, newItem]);
    setIsAddDialogOpen(false);
    setNewItemLabel("");
    setNewItemUrl("");
  };

  const handleRemoveItem = (id) => {
    savePinnedItems(pinnedItems.filter((item) => item.id !== id));
  };

  const handleOpenEditDialog = (item) => {
    setEditingItem(item);
    setNewItemLabel(item.label);
    setNewItemUrl(item.url);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = () => {
    if (!newItemLabel.trim() || !newItemUrl.trim() || !editingItem) return;

    const updatedItems = pinnedItems.map((item) =>
      item.id === editingItem.id
        ? {
          ...item,
          label: newItemLabel.trim(),
          url: newItemUrl.trim().startsWith("http") ? newItemUrl.trim() : `https://${newItemUrl.trim()}`,
        }
        : item
    );

    savePinnedItems(updatedItems);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setNewItemLabel("");
    setNewItemUrl("");
  };

  const handleOpenAddDialog = () => {
    if (pinnedItems.length >= MAX_PINNED_ITEMS) {
      alert(`Maksimum ${MAX_PINNED_ITEMS} adet pinned button ekleyebilirsiniz.`);
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleMoveUp = (id) => {
    const index = pinnedItems.findIndex((item) => item.id === id);
    if (index > 0) {
      const newItems = [...pinnedItems];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      savePinnedItems(newItems);
    }
  };

  const handleMoveDown = (id) => {
    const index = pinnedItems.findIndex((item) => item.id === id);
    if (index < pinnedItems.length - 1) {
      const newItems = [...pinnedItems];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      savePinnedItems(newItems);
    }
  };

  return (
    <>
      <div className="bg-linear-to-b from-blue-200 to-white dark:from-neutral-900 dark:to-neutral-800 min-h-screen flex flex-col p-12 select-none transition-colors duration-300">
        <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <CustomCommand />
            <MehasoftAi />
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {pinnedItems.map((item, index) => (
              <PinnedButton
                key={item.id}
                label={item.label}
                url={item.url}
                onRemove={() => handleRemoveItem(item.id)}
                onEdit={() => handleOpenEditDialog(item)}
                onMoveUp={() => handleMoveUp(item.id)}
                onMoveDown={() => handleMoveDown(item.id)}
                isFirst={index === 0}
                isLast={index === pinnedItems.length - 1}
              />
            ))}
            {pinnedItems.length < MAX_PINNED_ITEMS && (
              <PinnedAddButton onClick={handleOpenAddDialog} />
            )}
          </div>

          {/* Add Item Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kısayol Ekle</DialogTitle>
                <DialogDescription>
                  Hızlı erişmek istediğiniz siteyi ekleyin. Maksimum {MAX_PINNED_ITEMS} adet ekleyebilirsiniz.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="label" className="text-sm font-medium">
                    Etiket
                  </label>
                  <Input
                    id="label"
                    placeholder="Örn: YouTube"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddItem();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="url" className="text-sm font-medium">
                    URL
                  </label>
                  <Input
                    id="url"
                    placeholder="Örn: youtube.com"
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddItem();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItemLabel.trim() || !newItemUrl.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ekle
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Item Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kısayolu Düzenle</DialogTitle>
                <DialogDescription>
                  Kısayol bilgilerini güncelleyin.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-label" className="text-sm font-medium">
                    Etiket
                  </label>
                  <Input
                    id="edit-label"
                    placeholder="Örn: YouTube"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditItem();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-url" className="text-sm font-medium">
                    URL
                  </label>
                  <Input
                    id="edit-url"
                    placeholder="Örn: youtube.com"
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditItem();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingItem(null);
                    setNewItemLabel("");
                    setNewItemUrl("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleEditItem}
                  disabled={!newItemLabel.trim() || !newItemUrl.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Güncelle
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col gap-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <CalendarCard />
              <TodoCard />
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <TranslateCard />
              <MusicCard />
            </div>
          </div>

          {/* <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button variant="outline">Open</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default App
