import { Bot, Send, Loader2, Sparkles, Sparkle, Trash2, X, User, Copy, Check, Edit2, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { callGeminiAPI, processAgentActions } from "@/lib/geminiService";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const CHAT_HISTORY_KEY = "mehasoftAiChatHistory";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const MehasoftAi = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
            try {
                setMessages(JSON.parse(storedHistory));
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        if (!GEMINI_API_KEY) {
            setMessages([
                ...messages,
                {
                    role: "assistant",
                    content: "❌ Gemini API anahtarı bulunamadı. Lütfen .env dosyasına VITE_GEMINI_API_KEY ekleyin.",
                },
            ]);
            return;
        }

        const userMessage = inputValue.trim();
        setInputValue("");
        const newMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await callGeminiAPI(userMessage, messages, GEMINI_API_KEY);
            const result = processAgentActions(response);
            setMessages([...newMessages, { 
                role: "assistant", 
                content: result.text,
                actions: result.actions 
            }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages([...newMessages, { role: "assistant", content: `❌ Hata: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);
    };

    const copyToClipboard = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const startEditing = (index, text) => {
        setEditingIndex(index);
        setEditingText(text);
    };

    const saveEdit = async () => {
        if (!editingText.trim() || editingIndex === null) return;

        const updatedMessages = [...messages];
        updatedMessages[editingIndex] = {
            ...updatedMessages[editingIndex],
            content: editingText.trim()
        };

        // Eğer user mesajını düzenlediyse, sonraki assistant mesajlarını sil ve yeniden sor
        if (updatedMessages[editingIndex].role === "user") {
            const messagesToKeep = updatedMessages.slice(0, editingIndex + 1);
            setMessages(messagesToKeep);
            setEditingIndex(null);
            setEditingText("");
            setIsLoading(true);

            try {
                const historyForApi = messagesToKeep.slice(0, -1);
                const response = await callGeminiAPI(editingText.trim(), historyForApi, GEMINI_API_KEY);
                const result = processAgentActions(response);
                setMessages([...messagesToKeep, { 
                    role: "assistant", 
                    content: result.text,
                    actions: result.actions 
                }]);
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                setMessages([...messagesToKeep, { role: "assistant", content: `❌ Hata: ${error.message}` }]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setMessages(updatedMessages);
            setEditingIndex(null);
            setEditingText("");
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <button
                onClick={() => setIsOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter") setIsOpen(true); }}
                className="flex group items-center justify-center size-12 rounded-xl bg-white dark:bg-neutral-800 border cursor-pointer shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                title="Mehasoft AI"
            >
                <Sparkle strokeWidth={1.5} size={24} className="text-black dark:text-white group-hover:rotate-90 transition-all" />
            </button>
            
            <DialogContent className="w-full max-w-2xl h-[600px] flex flex-col p-0 gap-0" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Mehasoft AI - Yapay Zeka Asistanı</DialogTitle>
                    <DialogDescription>
                        Mehasoft AI ile sohbet edin, sorularınızı sorun ve yardım alın
                    </DialogDescription>
                </VisuallyHidden>
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg border">
                            <Sparkle strokeWidth={1.5} className="size-6 text-black dark:text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Mehasoft AI</h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Yapay Zeka Asistanınız</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={clearChat} 
                            className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer" 
                            title="Sohbeti Temizle"
                        >
                            <Trash2 size={16} />
                            <span className="text-sm">Temizle</span>
                        </button>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="flex items-center gap-2 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer" 
                            title="Kapat"
                        >
                            <X size={16} />
                            <span className="text-sm">Kapat</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-50 dark:[&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
                    {messages.length === 0 && (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center space-y-3 text-blue-600 dark:text-blue-400">
                                <Sparkles strokeWidth={1} className="w-16 h-16 mx-auto" />
                                <p className="text-sm">Merhaba! Size nasıl yardımcı olabilirim?</p>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                                <div className="shrink-0">
                                    <div className="size-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Sparkle className="size-4 text-white" />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-2 max-w-[70%]">
                                {editingIndex === idx ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none min-h-[100px]"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEdit}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                            >
                                                <Check size={14} />
                                                Kaydet
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-300 transition-colors"
                                            >
                                                <X size={14} />
                                                İptal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`px-4 py-3 rounded-2xl ${
                                            msg.role === "user" 
                                                ? "bg-neutral-800 text-white rounded-tr-sm" 
                                                : "bg-linear-to-br from-blue-500 dark:from-blue-800 to-purple-600 dark:bg-purple-800 text-white rounded-tl-sm"
                                        }`}>
                                            {msg.role === "user" ? (
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                            ) : (
                                                <MarkdownRenderer content={msg.content} />
                                            )}
                                        </div>
                                        
                                        {/* Onay gerektiren URL'ler için butonlar */}
                                        {msg.role === "assistant" && msg.actions && msg.actions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {msg.actions.map((action, actionIdx) => (
                                                    <button
                                                        key={actionIdx}
                                                        onClick={() => window.open(action.url, '_blank', 'noopener,noreferrer')}
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
                                                        title={`${action.siteName} sitesini aç`}
                                                    >
                                                        <ExternalLink size={14} />
                                                        <span>{action.siteName} sitesini aç</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-1">
                                            {msg.role === "assistant" && (
                                                <button
                                                    onClick={() => copyToClipboard(msg.content, idx)}
                                                    className="flex cursor-pointer items-center gap-1 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                                    title="Kopyala"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <>
                                                            <Check size={12} />
                                                            <span>Kopyalandı</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} />
                                                            <span>Kopyala</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {msg.role === "user" && (
                                                <button
                                                    onClick={() => startEditing(idx, msg.content)}
                                                    className="flex cursor-pointer items-center gap-1 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 size={12} />
                                                    <span>Düzenle</span>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            {msg.role === "user" && (
                                <div className="shrink-0">
                                    <div className="size-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                        <User className="size-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="shrink-0">
                                <div className="size-8 rounded-full bg-linear-to-br from-blue-500 dark:from-blue-800 to-purple-600 dark:bg-purple-800 flex items-center justify-center">
                                    <Sparkle className="size-4 text-white" />
                                </div>
                            </div>
                            <div className="bg-linear-to-br from-blue-500 dark:from-blue-800 to-purple-600 dark:bg-purple-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t px-6 py-4">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    handleSendMessage(); 
                                }
                                if (e.key === "Escape") setIsOpen(false);
                            }}
                            placeholder="Mesajınızı yazın... (Enter: gönder, Shift+Enter: yeni satır)"
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all resize-none min-h-12 max-h-[200px] overflow-y-auto"
                            style={{
                                height: 'auto',
                                minHeight: '48px',
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                            }}
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={!inputValue.trim() || isLoading} 
                            className="size-12 shrink-0 inline-flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            title="Gönder (Enter)"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};