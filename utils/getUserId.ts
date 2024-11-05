/**
 * This helper function generates a random userId.
 * It generates a new id every 5 minutes and retrieves it from local storage.
 * The userId is length 
 */
export default function getUserId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    const userId = Math.random().toString(36).substring(2, 15);
    return userId;
  }

  const now = Date.now();
  const storedData = localStorage.getItem('userId');

  if (storedData) {
    try {
      const { id, timestamp } = JSON.parse(storedData);
      if (now - timestamp < 10000) {
        return id;
      }
    } catch (error) {
      console.error('Error parsing stored userId:', error);
    }
  }

  const newId = Math.random().toString(36).substring(2, 15);
  const storageId = JSON.stringify({ id: newId, timestamp: now })
  localStorage.setItem('userId', storageId);
  return newId;
}