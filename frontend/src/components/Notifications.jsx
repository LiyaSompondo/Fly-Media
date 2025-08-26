// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react'; // install with `npm i lucide-react` if not installed
import {
  getNotifications,
  addNotification,
  markAsRead,
  markAllRead,
  removeNotification,
} from '../services/notificationsService';
import '../styles/Notifications.css';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setNotifs(getNotifications());
    const handler = () => setNotifs(getNotifications());
    window.addEventListener('notificationsUpdated', handler);
    return () => window.removeEventListener('notificationsUpdated', handler);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  function handleAddTest() {
    const n = addNotification({ title: title || 'Test Notification', message: message || 'This is a test', type: 'info' });
    setTitle('');
    setMessage('');
    setShowCreate(false);
    setNotifs(getNotifications());
    // optionally: POST to your backend here
    return n;
  }

  function handleMarkAllRead() {
    markAllRead();
    setNotifs(getNotifications());
  }

  function handleMarkRead(id) {
    markAsRead(id);
    setNotifs(getNotifications());
  }

  function handleDelete(id) {
    removeNotification(id);
    setNotifs(getNotifications());
  }

  return (
    <div className="notifications-widget">
      <div className="notifications-header">
        <div className="title">
          <Bell className="icon" />
          <h3>Notifications</h3>
        </div>

        <div className="controls">
          <button className="btn small" onClick={() => setShowCreate(s => !s)} title="Create test notification">
            {showCreate ? <X /> : 'New'}
          </button>
          <button className="btn small ghost" onClick={handleMarkAllRead} title="Mark all read">
            Mark all read
          </button>
        </div>
      </div>

      <div className="notifications-badge">
        {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : <span className="badge empty">0</span>}
      </div>

      {showCreate && (
        <div className="create-box">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
          <div className="create-actions">
            <button className="btn" onClick={handleAddTest}>Create</button>
          </div>
        </div>
      )}

      <div className="notifications-list">
        {notifs.length === 0 && <div className="empty">No notifications yet</div>}

        <ul>
          {notifs.map(n => (
            <li key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
              <div className="left">
                <div className="dot" aria-hidden>{n.read ? '' : <span />}</div>
                <div className="meta">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-message">{n.message}</div>
                </div>
              </div>

              <div className="right">
                <div className="time">{timeAgo(n.created_at)}</div>
                <div className="actions">
                  {!n.read && (
                    <button className="btn tiny" title="Mark read" onClick={() => handleMarkRead(n.id)}>
                      <Check size={14} />
                    </button>
                  )}
                  <button className="btn tiny danger" title="Delete" onClick={() => handleDelete(n.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
