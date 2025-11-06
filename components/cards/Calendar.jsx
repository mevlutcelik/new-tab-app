import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";

export const CalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Update time every minute
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const days = ["PAZAR", "PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ"];
    const months = [
        "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
        "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
    ];

    const dayName = days[currentDate.getDay()];
    const dayNumber = currentDate.getDate();
    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    // Pazar ve Cumartesi için kırmızı renk
    // const isDayOff = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    return (
        <div className="sm:col-span-1 flex flex-col justify-center gap-4 rounded-3xl w-full p-4 mx-auto bg-white dark:bg-neutral-800 border cursor-text shadow-md transition-colors">
            <div className="flex items-center gap-1">
                <CalendarDays size={16} className="text-neutral-500 dark:text-neutral-400 mb-0.5" />
                <span className="ml-2 text-sm font-light text-neutral-500 dark:text-neutral-400 tracking-tighter">BUGÜNÜN TARİHİ</span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl p-4 h-48 flex flex-col items-center justify-center gap-1 transition-colors">
                <div className={`text-base font-medium text-red-700 dark:text-red-400`}>
                    {dayName}
                </div>
                <div className="text-neutral-700 dark:text-neutral-200 text-6xl font-thin">{dayNumber}</div>
                <div className="text-sm font-light text-neutral-500 dark:text-neutral-400">
                    {monthName} {year}
                </div>
            </div>
        </div>
    );
};