const STORAGE_KEY = 'notifications_v1';

export function getNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotifications(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // Broadcast to other tabs/components
  window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { timestamp: Date.now() } }));
}

export function addNotification({ title = 'Notification', message = '', type = 'info', action_url = null } = {}) {
  const all = getNotifications();
  const n = {
    id: Date.now(),
    title,
    message,
    type,
    action_url,
    created_at: new Date().toISOString(),
    read: false,
  };
  all.unshift(n);
  saveNotifications(all);
  return n;
}

export function markAsRead(id) {
  const all = getNotifications().map(n => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(all);
}

export function markAllRead() {
  const all = getNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(all);
}

export function removeNotification(id) {
  const all = getNotifications().filter(n => n.id !== id);
  saveNotifications(all);
}

export function clearNotifications() {
  saveNotifications([]);
}
