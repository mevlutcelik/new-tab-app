// lib/storage.js

export const isSetupComplete = () => {
  return localStorage.getItem("setup_complete") === "true";
};

export const setSetupComplete = () => {
  localStorage.setItem("setup_complete", "true");
};

export const getUserSettings = () => {
  const raw = localStorage.getItem("user_settings");
  return raw ? JSON.parse(raw) : null;
};

export const setUserSettings = (settings) => {
  localStorage.setItem("user_settings", JSON.stringify(settings));
};

export const resetSettings = () => {
  localStorage.removeItem("setup_complete");
  localStorage.removeItem("user_settings");
};