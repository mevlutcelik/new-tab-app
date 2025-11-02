import { ListTodo, Check, Plus, X, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "todoItems";

export const TodoCard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Load todos from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTodos(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading todos:", error);
        }
    }, []);

    // Save todos to localStorage whenever they change
    const saveTodos = (newTodos) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
            setTodos(newTodos);
        } catch (error) {
            console.error("Error saving todos:", error);
        }
    };

    const addTodo = () => {
        if (!newTodoText.trim()) return;

        const newTodo = {
            id: Date.now(),
            text: newTodoText.trim(),
            completed: false,
        };

        saveTodos([...todos, newTodo]);
        setNewTodoText("");
        setIsAdding(false);
    };

    const toggleTodo = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(updatedTodos);
    };

    const deleteTodo = (id) => {
        saveTodos(todos.filter((todo) => todo.id !== id));
    };

    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditingText(todo.text);
    };

    const saveEdit = () => {
        if (!editingText.trim()) return;
        
        const updatedTodos = todos.map((todo) =>
            todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
        );
        saveTodos(updatedTodos);
        setEditingId(null);
        setEditingText("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const deleteCompleted = () => {
        saveTodos(todos.filter((todo) => !todo.completed));
    };

    const hasCompletedTodos = todos.some((todo) => todo.completed);

    return (
        <div className="sm:col-span-2 overflow-hidden flex flex-col justify-center gap-4 rounded-3xl w-full mx-auto bg-white border shadow-md p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <ListTodo size={16} className="text-neutral-500 mb-0.5" />
                    <span className="ml-2 text-sm font-light text-neutral-500 tracking-tighter">YAPILACAKLAR</span>
                </div>
                <div className="flex items-center gap-2">
                    {hasCompletedTodos && (
                        <button
                            onClick={deleteCompleted}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all cursor-pointer"
                        >
                            <Trash2 size={12} />
                            <span>Tamamlananları Sil</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center size-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all cursor-pointer"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <div className="h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-200">
                <div className={cn("bg-neutral-50 border rounded-2xl flex flex-col gap-3 mr-2", todos.length === 0 && !isAdding && "items-center justify-center h-full")}>
                    {/* Add new todo */}
                    {isAdding && (
                        <div className="flex w-full items-center gap-3 p-4 border-b">
                            <input
                                type="text"
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addTodo();
                                    if (e.key === "Escape") {
                                        setIsAdding(false);
                                        setNewTodoText("");
                                    }
                                }}
                                placeholder="Yeni görev yazın..."
                                autoFocus
                                className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={addTodo}
                                disabled={!newTodoText.trim()}
                                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                            >
                                Ekle
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewTodoText("");
                                }}
                                className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
                            >
                                İptal
                            </button>
                        </div>
                    )}


                    {/* Empty state */}
                    {todos.length === 0 && !isAdding && (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center text-neutral-400 gap-2 p-4">
                                <ListTodo size={32} />
                                <div className="text-sm">Henüz görev eklenmemiş</div>
                            </div>
                        </div>
                    )}

                    {/* Todo list */}
                    {todos.length > 0 && (
                        <div className="p-2 flex flex-col gap-2 w-full">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className={`flex items-center gap-3 border border-neutral-200 group p-3 rounded-xl transition-all ${todo.completed
                                        ? "bg-green-50 hover:bg-green-100"
                                        : "bg-white hover:bg-neutral-100"
                                        }`}
                                >
                                    {editingId === todo.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveEdit();
                                                    if (e.key === "Escape") cancelEdit();
                                                }}
                                                autoFocus
                                                className="flex-1 px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={saveEdit}
                                                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
                                            >
                                                Kaydet
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
                                            >
                                                İptal
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => toggleTodo(todo.id)}
                                                className={`flex items-center justify-center size-5 min-w-5 min-h-5 border-2 rounded-md transition-all cursor-pointer ${todo.completed
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "border-neutral-300 text-neutral-500 hover:border-green-400 hover:bg-green-50"
                                                    }`}
                                            >
                                                {todo.completed && <Check size={12} strokeWidth={3} />}
                                            </button>
                                            <div
                                                className={`flex-1 text-sm leading-relaxed transition-all ${todo.completed
                                                    ? "line-through text-neutral-500"
                                                    : "text-neutral-800"
                                                    }`}
                                            >
                                                {todo.text}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-white">
                                                    <DropdownMenuItem
                                                        onClick={() => startEditing(todo)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        <span>Düzenle</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deleteTodo(todo.id)}
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Sil</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};