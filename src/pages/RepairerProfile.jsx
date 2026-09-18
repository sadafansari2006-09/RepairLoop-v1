import { useRef } from "react";
import { useApp } from "../context/AppContext";

export default function RepairerProfile() {
  const { repairer, requests, repairerAvatar, updateRepairerAvatar } = useApp();
  const myJobs = requests.filter((r) => r.chosenRepairerId === repairer.id);
  const fileInputRef = useRef(null);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateRepairerAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Repairer profile</h1>
          <p>How owners see you on RepairLoop.</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="avatar-upload">
          <div
            className="avatar"
            style={repairerAvatar ? { backgroundImage: `url(${repairerAvatar})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
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
          <h3 style={{ marginBottom: 2 }}>{repairer.shopName}</h3>
          <p style={{ margin: 0, color: "var(--bark-soft)" }}>{repairer.name} · {repairer.specialty}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label className="form-label">Location</label>
          <p style={{ margin: 0 }}>{repairer.location}</p>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Repairing since</label>
          <p style={{ margin: 0 }}>{repairer.memberSince}</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="stat-card">
          <div className="num">{repairer.rating}</div>
          <div className="label">Rating</div>
        </div>
        <div className="stat-card">
          <div className="num">{repairer.jobsCompleted}</div>
          <div className="label">Jobs completed</div>
        </div>
        <div className="stat-card">
          <div className="num">{myJobs.length}</div>
          <div className="label">Active on RepairLoop</div>
        </div>
      </div>
    </div>
  );
}