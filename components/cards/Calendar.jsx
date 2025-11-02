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
    const isDayOff = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    return (
        <div className="sm:col-span-1 flex flex-col justify-center gap-4 rounded-3xl w-full p-4 mx-auto bg-white border cursor-text shadow-md">
            <div className="flex items-center gap-1">
                <CalendarDays size={16} className="text-neutral-500 mb-0.5" />
                <span className="ml-2 text-sm font-light text-neutral-500 tracking-tighter">BUGÜNÜN TARİHİ</span>
            </div>
            <div className="bg-neutral-50 border rounded-2xl p-4 h-48 flex flex-col items-center justify-center gap-1">
                <div className={`text-base font-medium ${isDayOff ? "text-red-700" : "text-neutral-700"}`}>
                    {dayName}
                </div>
                <div className="text-neutral-700 text-6xl font-thin">{dayNumber}</div>
                <div className="text-sm font-light text-neutral-500">
                    {monthName} {year}
                </div>
            </div>
        </div>
    );
};