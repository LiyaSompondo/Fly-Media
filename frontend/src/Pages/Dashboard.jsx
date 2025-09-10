import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import flyMediaLogo from "../assets/flymedia-logo.jpg";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import FileUpload from "../components/FileUpload";
import Analytics from "../components/Analytics";
import ActivityFeed from "../components/ActivityFeed";
import Profile from "../components/Profile";

// ✅ Notifications service functions
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationsService";

// ✅ Use environment variable for backend
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [uploads, setUploads] = useState([]); // local-only
  const [files, setFiles] = useState([]); // from backend
  const [notifications, setNotifications] = useState([]); // backend notifications

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || "User");
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }, []);

  // Fetch uploaded files from backend
  useEffect(() => {
    fetch(`${API_URL}/files`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  // Notification actions
  const handleMarkAsRead = async (id) => {
    const updated = await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    const updated = await markAllAsRead();
    setNotifications(updated);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="dashboard-container">
      {/* Hero Header */}
      <header className="dashboard-hero">
        <div className="hero-content">
          <img
            src={flyMediaLogo}
            alt="Fly Media Logo"
            className="dashboard-logo"
          />
          <h1 className="hero-title">Welcome, {userName}!</h1>
          <div className="tagline-hero">
            <em>Grow digital with us - Fly Media</em>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Tasks */}
        <section className="dashboard-section">
          <h2>Tasks</h2>
          <TaskList />
        </section>

        {/* Calendar */}
        <section className="dashboard-section">
          <h2>Calendar</h2>
          <Calendar />
        </section>

        {/* Uploads */}
        <section className="dashboard-section">
          <h2>Uploaded Files</h2>
          <FileUpload onChange={setUploads} />

          {/* Local uploads */}
          <div className="uploads-section">
            <div className="section-head">
              <h3>Recent Local Uploads</h3>
              <span className="count-chip">{uploads.length}</span>
            </div>

            {uploads.length === 0 ? (
              <p className="muted">No local files uploaded yet.</p>
            ) : (
              <ul className="file-list">
                {uploads.map((f) => (
                  <li key={f.id} className="file-row">
                    <div className="file-main">
                      <div className="file-name">{f.name}</div>
                      <div className="file-meta">
                        <span>{(f.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <span>• {f.type || "unknown"}</span>
                        <span>
                          • {new Date(f.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className={`status ${f.status}`}>{f.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Backend uploads */}
          <div className="uploads-section">
            <div className="section-head">
              <h3>Server Files</h3>
              <span className="count-chip">{files.length}</span>
            </div>

            {files.length === 0 ? (
              <p className="muted">No files uploaded to server yet.</p>
            ) : (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={i} className="file-row">
                    <a
                      href={`${API_URL}/uploads/${f}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {f}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section className="dashboard-section">
          <h2>Notifications</h2>

          {notifications.length === 0 ? (
            <p className="muted">No notifications yet.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notification ${n.read ? "read" : "unread"}`}>
                  <div className="notif-main">
                    <strong>{n.title}</strong> — {n.message}
                    <div className="notif-meta">
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                      {n.type && <span className={`tag ${n.type}`}>{n.type}</span>}
                      {n.action_url && (
                        <a href={n.action_url} target="_blank" rel="noreferrer">
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="notif-actions">
                    {!n.read && (
                      <button onClick={() => handleMarkAsRead(n.id)}>
                        Mark Read
                      </button>
                    )}
                    <button onClick={() => handleDelete(n.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {notifications.length > 0 && (
            <button onClick={handleMarkAllAsRead} className="mark-all-btn">
              Mark All as Read
            </button>
          )}
        </section>

        {/* Analytics */}
        <section className="dashboard-section">
          <h2>Analytics</h2>
          <Analytics />
        </section>

        {/* Activity Feed */}
        <section className="dashboard-section">
          <h2>Activity Feed</h2>
          <ActivityFeed />
        </section>

        {/* Profile */}
        <section className="dashboard-section">
          <h2>Profile</h2>
          <Profile />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
