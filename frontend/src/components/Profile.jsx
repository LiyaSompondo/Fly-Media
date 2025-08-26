import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const STORAGE_KEY = "userProfile";

const defaultProfile = {
  name: "",
  email: "",
  company: "",
  avatarDataUrl: null, // base64 / data URL
  emailNotifications: true,
  pushNotifications: true,
  memberSince: new Date().toISOString(), // set on first save
};

function getInitials(name) {
  if (!name) return "FM";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [avatarFileName, setAvatarFileName] = useState(null);

  // load profile from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProfile(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }, []);

  // helper: validate form
  const validate = () => {
    const e = {};
    if (!profile.name || profile.name.trim().length < 2) {
      e.name = "Please enter your name (at least 2 characters).";
    }
    if (!profile.email) {
      e.email = "Please enter an email.";
    } else {
      // basic email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(profile.email)) e.email = "Please enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // read image file and convert to data URL
  const handleAvatarChange = (evt) => {
    const file = evt.target.files[0];
    if (!file) return;
    setAvatarFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfile((p) => ({ ...p, avatarDataUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfile((p) => ({ ...p, avatarDataUrl: null }));
    setAvatarFileName(null);
  };

  const handleChange = (field) => (evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setProfile((p) => ({ ...p, [field]: value }));
  };

  // dynamic import of notificationsService (safe if missing)
  const notify = async (title, message) => {
    try {
      const svc = await import("../services/notificationsService");
      if (svc && typeof svc.addNotification === "function") {
        svc.addNotification({ title, message, type: "profile" });
      }
    } catch (err) {
      // no service available — ok to ignore
      // console.warn("notificationsService not available", err);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStatusMsg("");
    if (!validate()) {
      setStatusMsg("Fix errors before saving.");
      return;
    }

    const now = new Date().toISOString();
    const toSave = {
      ...profile,
      memberSince: profile.memberSince || now,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setProfile(toSave);
      setStatusMsg("Profile saved.");
      notify("Profile updated", "Your profile information was updated");

      // clear status after 2.5s
      setTimeout(() => setStatusMsg(""), 2500);
    } catch (err) {
      console.error("Cannot save profile:", err);
      setStatusMsg("Failed to save profile.");
    }
  };

  const handleLogout = () => {
    // remove user profile locally (not deleting other app data)
    localStorage.removeItem(STORAGE_KEY);
    // optionally clear auth tokens here
    // localStorage.removeItem('authToken')

    // navigate to login page
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar-wrapper">
            {profile.avatarDataUrl ? (
              <img src={profile.avatarDataUrl} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-fallback">{getInitials(profile.name || "Fly Media")}</div>
            )}
          </div>

          <div className="member-info">
            <div className="member-name">{profile.name || "Your name"}</div>
            <div className="member-company">{profile.company || "Company / Organization"}</div>
            <div className="member-since">Member since: {new Date(profile.memberSince).toLocaleDateString()}</div>
          </div>

          <div className="avatar-controls">
            <label htmlFor="avatarInput" className="btn btn-ghost">Change Avatar</label>
            <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            {profile.avatarDataUrl && (
              <button className="btn btn-danger" onClick={handleRemoveAvatar}>Remove</button>
            )}
            {avatarFileName && <div className="avatar-filename">{avatarFileName}</div>}
          </div>
        </div>

        <form className="profile-right" onSubmit={handleSave}>
          <h2>Profile</h2>

          <label>
            Full name
            <input type="text" value={profile.name} onChange={handleChange("name")} placeholder="Jane Doe" />
            {errors.name && <div className="error">{errors.name}</div>}
          </label>

          <label>
            Email
            <input type="email" value={profile.email} onChange={handleChange("email")} placeholder="you@example.com" />
            {errors.email && <div className="error">{errors.email}</div>}
          </label>

          <label>
            Company
            <input type="text" value={profile.company} onChange={handleChange("company")} placeholder="Fly Media" />
          </label>

          <div className="toggles">
            <label className="toggle">
              <input type="checkbox" checked={profile.emailNotifications} onChange={handleChange("emailNotifications")} />
              <span> Email notifications</span>
            </label>

            <label className="toggle">
              <input type="checkbox" checked={profile.pushNotifications} onChange={handleChange("pushNotifications")} />
              <span> Push notifications</span>
            </label>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary">Save Profile</button>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </div>

          {statusMsg && <div className="status">{statusMsg}</div>}
        </form>
      </div>
    </div>
  );
}
