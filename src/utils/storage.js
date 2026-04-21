 // SAVE DATA (with timestamp)
export const saveData = (key, data) => {
  const payload = {
    data,
    timestamp: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(payload));
};

// GET DATA (with expiry check)
export const getData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // ⏱ Expiry time (24 hours)
    const EXPIRY_TIME = 1000 * 60 * 60 * 24;

    if (!parsed.timestamp || Date.now() - parsed.timestamp > EXPIRY_TIME) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Error parsing data:", error);
    return null;
  }
};

// REMOVE DATA
export const removeData = (key) => {
  localStorage.removeItem(key);
};