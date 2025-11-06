import { Languages, ArrowRight, Loader2, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { translate } from '@vitalets/google-translate-api';

export const TranslateCard = () => {
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [targetLang, setTargetLang] = useState("tr");
    const [error, setError] = useState("");

    const languages = [
        { code: "en", name: "İngilizce" },
        { code: "tr", name: "Türkçe" },
        { code: "es", name: "İspanyolca" },
        { code: "fr", name: "Fransızca" },
        { code: "de", name: "Almanca" },
        { code: "it", name: "İtalyanca" },
        { code: "pt", name: "Portekizce" },
        { code: "ru", name: "Rusça" },
        { code: "ja", name: "Japonca" },
        { code: "zh", name: "Çince" },
        { code: "ar", name: "Arapça" },
    ];

    const translateText = async () => {
        if (!sourceText.trim()) return;

        setIsLoading(true);
        setError("");
        try {
            const result = await translate(sourceText, { to: targetLang });
            setTranslatedText(result.text);

            if (result.raw?.src) {
                const langName = languages.find(l => l.code === result.raw.src)?.name || result.raw.src;
                setDetectedLanguage(langName);
            }
        } catch (error) {
            console.error("Translation error:", error);
            setError("Çeviri hatası oluştu. Lütfen tekrar deneyin.");
            setTranslatedText("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            translateText();
        }
    };

    const clearAll = () => {
        setSourceText("");
        setTranslatedText("");
        setDetectedLanguage("");
        setError("");
    };

    return (
        <div className="sm:col-span-2 flex flex-col justify-center gap-4 rounded-3xl w-full p-4 mx-auto bg-white dark:bg-neutral-800 border dark:border-neutral-700 cursor-text shadow-md transition-colors">
            <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                    <Languages strokeWidth={1.75} size={16} className="text-neutral-500 dark:text-neutral-400 mb-0.5" />
                    <span className="ml-2 text-sm font-light text-neutral-500 dark:text-neutral-400 tracking-tighter">ÇEVİRİ</span>
                </div>
                <div className="flex items-center gap-2">
                    {(sourceText || translatedText) && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 px-2 py-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
                            title="Temizle"
                        >
                            <Trash2 size={14} />
                            <span className="text-xs">Temizle</span>
                        </button>
                    )}
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="px-3 py-1.5 text-xs border dark:border-neutral-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white dark:bg-neutral-700 dark:text-white transition-colors"
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl p-4 flex flex-col gap-3 transition-colors">
                {/* Input area */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            {detectedLanguage ? `Algılanan: ${detectedLanguage}` : "Otomatik Algıla"}
                        </span>
                    </div>
                    <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Çevrilecek metni yazın..."
                        className="w-full px-3 py-2 text-sm border dark:border-neutral-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-neutral-800 dark:text-white transition-colors placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                        rows={3}
                    />
                </div>

                {/* Translate button */}
                <button
                    onClick={translateText}
                    disabled={!sourceText.trim() || isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Çevriliyor...</span>
                        </>
                    ) : (
                        <>
                            <span>Çevir</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>

                {/* Translation result */}
                {translatedText && (
                    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-800 border dark:border-neutral-600 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                {languages.find(l => l.code === targetLang)?.name}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                            {translatedText}
                        </p>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};