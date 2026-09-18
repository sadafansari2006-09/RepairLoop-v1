import { useRef } from "react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user, items, requests, userAvatar, updateUserAvatar } = useApp();
  const fileInputRef = useRef(null);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUserAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p>Your account details.</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="avatar-upload">
          <div
            className="avatar"
            style={userAvatar ? { backgroundImage: `url(${userAvatar})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
          />
          <button type="button" className="avatar-edit-btn" onClick={() => fileInputRef.current.click()}>
            Change photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h3 style={{ marginBottom: 2 }}>{user.name}</h3>
          <p style={{ margin: 0, color: "var(--bark-soft)" }}>{user.email}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label className="form-label">Location</label>
          <p style={{ margin: 0 }}>{user.location}</p>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Member since</label>
          <p style={{ margin: 0 }}>{user.memberSince}</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="stat-card">
          <div className="num">{items.length}</div>
          <div className="label">Items reported</div>
        </div>
        <div className="stat-card">
          <div className="num">{requests.filter((r) => r.status === "completed").length}</div>
          <div className="label">Repairs completed</div>
        </div>
      </div>
    </div>
  );
}