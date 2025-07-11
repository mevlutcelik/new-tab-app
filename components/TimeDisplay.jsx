'use client'
import React, { useState, useEffect } from "react";

export default function TimeDisplay({ showSeconds = false }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalDuration = showSeconds ? 1000 : 60000;
    const timer = setInterval(() => setTime(new Date()), intervalDuration);
    return () => clearInterval(timer);
  }, [showSeconds]);

  const formattedTime = showSeconds
    ? time.toLocaleTimeString("tr-TR")
    : time.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="text-9xl font-bold text-white">{formattedTime}</div>
  );
}
