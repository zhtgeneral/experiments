export default function getUserId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return Math.random().toString(36).substring(2, 15);
  }

  const now = Date.now();
  const storedData = localStorage.getItem('userId');

  if (storedData) {
    try {
      const { id, timestamp } = JSON.parse(storedData);
      // if (now - timestamp < 300000) {
      if (now - timestamp < 10000) {
        return id;
      }
    } catch (error) {
      console.error('Error parsing stored userId:', error);
    }
  }

  const newId = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', JSON.stringify({ id: newId, timestamp: now }));
  return newId;
}