import { useState, useEffect } from 'react';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        const key = "a001ead4df563af7bade6fd546bf943b";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=tr`;

        fetch(url)
          .then((res) => res.json())
          .then(setWeather)
          .catch(() => setWeather(null));
      },
      () => setWeather(null)
    );
  }, []);

  return weather;
};
