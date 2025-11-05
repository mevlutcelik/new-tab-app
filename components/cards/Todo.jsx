import { ListTodo, Check, Plus, X, Edit2, Trash2, MoreVertical, GripVertical, ChevronDown, ChevronRight, Smile } from "lucide-react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Lazy load emoji picker for better performance
const EmojiPicker = lazy(() => import('emoji-picker-react'));

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STORAGE_KEY = "todoItems";

// Türkçe-İngilizce emoji arama ipuçları
// const searchHints = [
//     'kalp → heart', 'gülen → smile', 'yıldız → star', 'ateş → fire',
//     'kedi → cat', 'köpek → dog', 'çiçek → flower', 'güneş → sun',
//     'ay → moon', 'bulut → cloud', 'yağmur → rain', 'kar → snow',
//     'pizza → pizza', 'kahve → coffee', 'aşk → love', 'mutlu → happy',
//     'üzgün → sad', 'kızgın → angry', 'düşünce → think', 'bayrak → flag'
// ].join(' • ');

// Emoji Picker Portal Component
const EmojiPickerPortal = ({ show, onClose, onEmojiClick, position }) => {
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) return null;

    return createPortal(
        <div
            ref={pickerRef}
            className="fixed z-9999"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            <Suspense fallback={
                <div className="bg-white rounded-lg shadow-2xl p-4 border">
                    <div className="flex items-center justify-center h-[400px] w-[320px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            }>
                <div className="bg-white rounded-lg shadow-2xl border overflow-hidden">
                    {/* Türkçe-İngilizce İpuçları */}
                    {/* <div className="bg-blue-50 border-b border-blue-100 p-2 text-xs text-blue-700">
                        <div className="font-semibold mb-1">💡 Arama İpucu: İngilizce arama yapın</div>
                        <div className="text-blue-600 overflow-x-auto whitespace-nowrap scrollbar-thin">
                            {searchHints}
                        </div>
                    </div> */}

                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        searchPlaceHolder="Emoji ara (ör: kalp, yıldız, gülen)..."
                        width={320}
                        height={380}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                        searchDisabled={false}
                        categories={[
                            { name: 'Sık Kullanılanlar', category: 'suggested' },
                            { name: 'İfadeler', category: 'smileys_people' },
                            { name: 'Hayvanlar', category: 'animals_nature' },
                            { name: 'Yiyecek', category: 'food_drink' },
                            { name: 'Aktivite', category: 'activities' },
                            { name: 'Seyahat', category: 'travel_places' },
                            { name: 'Nesneler', category: 'objects' },
                            { name: 'Semboller', category: 'symbols' },
                            { name: 'Bayraklar', category: 'flags' },
                        ]}
                    />
                </div>
            </Suspense>
        </div>,
        document.body
    );
};

const SortableTodoItem = ({
    todo,
    editingId,
    editingText,
    setEditingText,
    saveEdit,
    cancelEdit,
    toggleTodo,
    toggleExpanded,
    expandedTodos,
    editingSubtask,
    editingSubtaskText,
    setEditingSubtaskText,
    saveSubtaskEdit,
    cancelSubtaskEdit,
    toggleSubtask,
    startEditingSubtask,
    deleteSubtask,
    addingSubtaskTo,
    newSubtaskText,
    setNewSubtaskText,
    addSubtask,
    setAddingSubtaskTo,
    setExpandedTodos,
    startEditing,
    deleteTodo,
    editInputRef,
    editSubtaskInputRef,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    showSubtaskEmojiPicker,
    setShowSubtaskEmojiPicker,
    handleSubtaskEmojiClick
}) => {
    const emojiButtonRef = useRef(null);
    const subtaskEmojiRefs = useRef({});

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
    const isExpanded = expandedTodos.has(todo.id);

    const getEmojiPickerPosition = (buttonRef) => {
        if (!buttonRef.current) return { top: 0, left: 0 };
        const rect = buttonRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + 5,
            left: rect.left,
        };
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                className={`flex ${isExpanded ? 'items-start' : 'items-center'} gap-3 border border-neutral-200 group p-3 rounded-xl transition-all ${todo.completed
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-white hover:bg-neutral-100"
                    }`}
            >
                {editingId === todo.id ? (
                    <>
                        <input
                            ref={editInputRef}
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") cancelEdit();
                            }}
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
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing mt-0.5"
                        >
                            <GripVertical size={16} className="text-neutral-400" />
                        </div>

                        {hasSubtasks && (
                            <button
                                onClick={() => toggleExpanded(todo.id)}
                                className="mt-0.5 text-neutral-500 hover:text-neutral-700 transition-all cursor-pointer"
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}

                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`flex items-center justify-center size-5 min-w-5 min-h-5 border-2 rounded-md transition-all cursor-pointer mt-0.5 ${todo.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-neutral-300 text-neutral-500 hover:border-green-400 hover:bg-green-50"
                                }`}
                        >
                            {todo.completed && <Check size={12} strokeWidth={3} />}
                        </button>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {/* Emoji Picker Button */}
                                <button
                                    ref={emojiButtonRef}
                                    onClick={() => setShowEmojiPicker(showEmojiPicker === todo.id ? null : todo.id)}
                                    className="flex items-center justify-center text-base size-8 min-w-8 min-h-8 border border-dashed rounded-full transition-all cursor-pointer mt-0.5 border-transparent hover:border-neutral-300 hover:bg-white"
                                    title="Emoji ekle"
                                >
                                    {todo.emoji || <Smile size={16} className="text-neutral-400" />}
                                </button>

                                <EmojiPickerPortal
                                    show={showEmojiPicker === todo.id}
                                    onClose={() => setShowEmojiPicker(null)}
                                    onEmojiClick={(emojiData) => handleEmojiClick(todo.id, emojiData)}
                                    position={getEmojiPickerPosition(emojiButtonRef)}
                                />

                                <div
                                    className={`text-sm leading-relaxed transition-all flex-1 ${todo.completed
                                        ? "line-through text-neutral-500"
                                        : "text-neutral-800"
                                        }`}
                                >
                                    {todo.text}
                                </div>
                            </div>

                            {/* Subtasks */}
                            {isExpanded && hasSubtasks && (
                                <div className="mt-2 ml-2 space-y-1.5 border-l-2 border-neutral-200 pl-3">
                                    {todo.subtasks.map((subtask) => (
                                        <div key={subtask.id} className="flex items-start gap-2 group/subtask">
                                            {editingSubtask.subtaskId === subtask.id ? (
                                                <>
                                                    <input
                                                        ref={editSubtaskInputRef}
                                                        type="text"
                                                        value={editingSubtaskText}
                                                        onChange={(e) => setEditingSubtaskText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") saveSubtaskEdit();
                                                            if (e.key === "Escape") cancelSubtaskEdit();
                                                        }}
                                                        className="flex-1 px-2 py-1 text-xs border rounded outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={saveSubtaskEdit}
                                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all cursor-pointer"
                                                    >
                                                        Kaydet
                                                    </button>
                                                    <button
                                                        onClick={cancelSubtaskEdit}
                                                        className="px-2 py-1 text-xs text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
                                                    >
                                                        İptal
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => toggleSubtask(todo.id, subtask.id)}
                                                        className={`flex items-center justify-center size-4 min-w-4 min-h-4 border-2 rounded transition-all cursor-pointer ${subtask.completed
                                                            ? "bg-green-500 border-green-500 text-white"
                                                            : "border-neutral-300 text-neutral-500 hover:border-green-400"
                                                            }`}
                                                    >
                                                        {subtask.completed && <Check size={10} strokeWidth={3} />}
                                                    </button>

                                                    {/* Subtask Emoji Picker */}
                                                    <button
                                                        ref={(el) => subtaskEmojiRefs.current[subtask.id] = el}
                                                        onClick={() => setShowSubtaskEmojiPicker(
                                                            showSubtaskEmojiPicker === subtask.id ? null : subtask.id
                                                        )}
                                                        className="text-sm hover:scale-110 transition-transform"
                                                        title="Emoji ekle"
                                                    >
                                                        {subtask.emoji || <Smile size={12} className="text-neutral-400" />}
                                                    </button>

                                                    <EmojiPickerPortal
                                                        show={showSubtaskEmojiPicker === subtask.id}
                                                        onClose={() => setShowSubtaskEmojiPicker(null)}
                                                        onEmojiClick={(emojiData) => handleSubtaskEmojiClick(todo.id, subtask.id, emojiData)}
                                                        position={getEmojiPickerPosition({ current: subtaskEmojiRefs.current[subtask.id] })}
                                                    />

                                                    <span
                                                        className={`text-xs flex-1 ${subtask.completed
                                                            ? "line-through text-neutral-400"
                                                            : "text-neutral-600"
                                                            }`}
                                                    >
                                                        {subtask.text}
                                                    </span>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="opacity-0 group-hover/subtask:opacity-100 size-5 flex items-center justify-center rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer">
                                                                <MoreVertical size={12} />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="bg-white">
                                                            <DropdownMenuItem
                                                                onClick={() => startEditingSubtask(todo.id, subtask)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Edit2 className="mr-2 h-3 w-3" />
                                                                <span className="text-xs">Düzenle</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => deleteSubtask(todo.id, subtask.id)}
                                                                variant="destructive"
                                                                className="cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-3 w-3" />
                                                                <span className="text-xs">Sil</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add subtask */}
                            {addingSubtaskTo === todo.id && (
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newSubtaskText}
                                        onChange={(e) => setNewSubtaskText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") addSubtask(todo.id);
                                            if (e.key === "Escape") {
                                                setAddingSubtaskTo(null);
                                                setNewSubtaskText("");
                                            }
                                        }}
                                        placeholder="Alt görev yazın..."
                                        autoFocus
                                        className="flex-1 px-2 py-1 text-xs border rounded outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => addSubtask(todo.id)}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all cursor-pointer"
                                    >
                                        Ekle
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAddingSubtaskTo(null);
                                            setNewSubtaskText("");
                                        }}
                                        className="px-2 py-1 text-xs text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
                                    >
                                        İptal
                                    </button>
                                </div>
                            )}
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
                                    onClick={() => {
                                        setAddingSubtaskTo(todo.id);
                                        setExpandedTodos(prev => new Set([...prev, todo.id]));
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Alt Görev Ekle</span>
                                </DropdownMenuItem>
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
        </div>
    );
};

export const TodoCard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [expandedTodos, setExpandedTodos] = useState(new Set());
    const [addingSubtaskTo, setAddingSubtaskTo] = useState(null);
    const [newSubtaskText, setNewSubtaskText] = useState("");
    const [editingSubtask, setEditingSubtask] = useState({ todoId: null, subtaskId: null });
    const [editingSubtaskText, setEditingSubtaskText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [showSubtaskEmojiPicker, setShowSubtaskEmojiPicker] = useState(null);

    const scrollContainerRef = useRef(null);
    const editInputRef = useRef(null);
    const editSubtaskInputRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
            // Save current scroll position
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
            setTodos(newTodos);

            // Restore scroll position after state update
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollTop;
                }
            });
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
            subtasks: [],
        };

        // Add to beginning of array
        saveTodos([newTodo, ...todos]);
        setNewTodoText("");
        setIsAdding(false);
    };

    const toggleTodo = (id) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                const newCompletedState = !todo.completed;
                // Eğer ana todo tamamlanıyorsa, tüm subtask'ları da tamamla
                const updatedSubtasks = newCompletedState && todo.subtasks
                    ? todo.subtasks.map(subtask => ({ ...subtask, completed: true }))
                    : todo.subtasks;
                
                return { 
                    ...todo, 
                    completed: newCompletedState,
                    subtasks: updatedSubtasks
                };
            }
            return todo;
        });
        saveTodos(updatedTodos);
    };

    const deleteTodo = (id) => {
        saveTodos(todos.filter((todo) => todo.id !== id));
    };

    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditingText(todo.text);
        // Focus input after render
        setTimeout(() => {
            editInputRef.current?.focus();
        }, 0);
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

    const toggleExpanded = (id) => {
        // Save current scroll position
        const scrollTop = scrollContainerRef.current?.scrollTop || 0;

        setExpandedTodos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });

        // Restore scroll position after state update
        requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollTop;
            }
        });
    };

    const addSubtask = (todoId) => {
        if (!newSubtaskText.trim()) return;

        const updatedTodos = todos.map((todo) => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    subtasks: [
                        ...(todo.subtasks || []),
                        {
                            id: Date.now(),
                            text: newSubtaskText.trim(),
                            completed: false,
                        }
                    ]
                };
            }
            return todo;
        });

        saveTodos(updatedTodos);
        setNewSubtaskText("");
        setAddingSubtaskTo(null);
        setExpandedTodos(prev => new Set([...prev, todoId]));
    };

    const toggleSubtask = (todoId, subtaskId) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    subtasks: todo.subtasks.map((subtask) =>
                        subtask.id === subtaskId
                            ? { ...subtask, completed: !subtask.completed }
                            : subtask
                    )
                };
            }
            return todo;
        });
        saveTodos(updatedTodos);
    };

    const deleteSubtask = (todoId, subtaskId) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    subtasks: todo.subtasks.filter((subtask) => subtask.id !== subtaskId)
                };
            }
            return todo;
        });
        saveTodos(updatedTodos);
    };

    const startEditingSubtask = (todoId, subtask) => {
        setEditingSubtask({ todoId, subtaskId: subtask.id });
        setEditingSubtaskText(subtask.text);
        // Focus input after render
        setTimeout(() => {
            editSubtaskInputRef.current?.focus();
        }, 0);
    };

    const saveSubtaskEdit = () => {
        if (!editingSubtaskText.trim()) return;

        const updatedTodos = todos.map((todo) => {
            if (todo.id === editingSubtask.todoId) {
                return {
                    ...todo,
                    subtasks: todo.subtasks.map((subtask) =>
                        subtask.id === editingSubtask.subtaskId
                            ? { ...subtask, text: editingSubtaskText.trim() }
                            : subtask
                    )
                };
            }
            return todo;
        });

        saveTodos(updatedTodos);
        setEditingSubtask({ todoId: null, subtaskId: null });
        setEditingSubtaskText("");
    };

    const cancelSubtaskEdit = () => {
        setEditingSubtask({ todoId: null, subtaskId: null });
        setEditingSubtaskText("");
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTodos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                saveTodos(newItems);
                return newItems;
            });
        }
    };

    const handleEmojiClick = (todoId, emojiData) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === todoId ? { ...todo, emoji: emojiData.emoji } : todo
        );
        saveTodos(updatedTodos);
        setShowEmojiPicker(null);
    };

    const handleSubtaskEmojiClick = (todoId, subtaskId, emojiData) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    subtasks: todo.subtasks.map((subtask) =>
                        subtask.id === subtaskId
                            ? { ...subtask, emoji: emojiData.emoji }
                            : subtask
                    )
                };
            }
            return todo;
        });
        saveTodos(updatedTodos);
        setShowSubtaskEmojiPicker(null);
    };

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
            <div
                ref={scrollContainerRef}
                className="h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-200"
            >
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
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={todos.map(t => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {todos.map((todo) => (
                                        <SortableTodoItem
                                            key={todo.id}
                                            todo={todo}
                                            editingId={editingId}
                                            editingText={editingText}
                                            setEditingText={setEditingText}
                                            saveEdit={saveEdit}
                                            cancelEdit={cancelEdit}
                                            toggleTodo={toggleTodo}
                                            toggleExpanded={toggleExpanded}
                                            expandedTodos={expandedTodos}
                                            editingSubtask={editingSubtask}
                                            editingSubtaskText={editingSubtaskText}
                                            setEditingSubtaskText={setEditingSubtaskText}
                                            saveSubtaskEdit={saveSubtaskEdit}
                                            cancelSubtaskEdit={cancelSubtaskEdit}
                                            toggleSubtask={toggleSubtask}
                                            startEditingSubtask={startEditingSubtask}
                                            deleteSubtask={deleteSubtask}
                                            addingSubtaskTo={addingSubtaskTo}
                                            newSubtaskText={newSubtaskText}
                                            setNewSubtaskText={setNewSubtaskText}
                                            addSubtask={addSubtask}
                                            setAddingSubtaskTo={setAddingSubtaskTo}
                                            setExpandedTodos={setExpandedTodos}
                                            startEditing={startEditing}
                                            deleteTodo={deleteTodo}
                                            editInputRef={editInputRef}
                                            editSubtaskInputRef={editSubtaskInputRef}
                                            showEmojiPicker={showEmojiPicker}
                                            setShowEmojiPicker={setShowEmojiPicker}
                                            handleEmojiClick={handleEmojiClick}
                                            showSubtaskEmojiPicker={showSubtaskEmojiPicker}
                                            setShowSubtaskEmojiPicker={setShowSubtaskEmojiPicker}
                                            handleSubtaskEmojiClick={handleSubtaskEmojiClick}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};