import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import flyMediaLogo from "../assets/flymedia-logo.jpg";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import FileUpload from "../components/FileUpload";
import Notifications from "../components/Notifications";
import Analytics from "../components/Analytics";
import ActivityFeed from "../components/ActivityFeed";
import Profile from "../components/Profile";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [uploads, setUploads] = useState([]); // local-only
  const [files, setFiles] = useState([]); // from backend

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

  useEffect(() => {
    // fetch uploaded files from backend
    fetch("http://localhost:5000/files")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div className="hero-content">
          <img src={flyMediaLogo} alt="Fly Media Logo" className="dashboard-logo" />
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
                        <span>• {new Date(f.uploadedAt).toLocaleString()}</span>
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
                      href={`http://localhost:5000/uploads/${f}`}
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

        {/* Other sections */}
        <section className="dashboard-section">
          <h2>Notifications</h2>
          <Notifications />
        </section>

        <section className="dashboard-section">
          <h2>Analytics</h2>
          <Analytics />
        </section>

        <section className="dashboard-section">
          <h2>Activity Feed</h2>
          <ActivityFeed />
        </section>

        <section className="dashboard-section">
          <h2>Profile</h2>
          <Profile />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
