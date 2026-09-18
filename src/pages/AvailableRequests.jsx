import { useState } from "react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function AvailableRequests() {
  const { requests, repairer, submitEstimate } = useApp();
  const [openForm, setOpenForm] = useState(null);
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");

  const available = requests.filter((r) => r.status === "open" || (r.status === "estimating" && !r.chosenRepairerId));

  function handleSubmit(requestId) {
    if (!price || !days) return;
    submitEstimate(requestId, {
      repairerId: repairer.id,
      repairerName: `${repairer.name} — ${repairer.shopName}`,
      price: Number(price),
      days: Number(days),
      message,
    });
    setOpenForm(null);
    setPrice("");
    setDays("");
    setMessage("");
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Available requests</h1>
          <p>Repair requests from owners nearby, waiting on an estimate.</p>
        </div>
      </div>

      {available.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing open right now</h3>
          <p>Check back soon newrequests appear here as owners submit them.</p>
        </div>
      ) : (
        <div className="row-list">
          {available.map((req) => (
            <div key={req.id} className="card">
              <div className="row-card-main" style={{ marginBottom: openForm === req.id ? 20 : 0 }}>
                <Photo src={req.image} gradientClass={req.photoClass} alt={req.itemName} className="row-thumb" />
                <div style={{ flex: 1 }}>
                  <div className="row-title">{req.itemName}</div>
                  <div className="row-sub">{req.category} · Submitted {req.createdAt}</div>
                  <p style={{ margin: "8px 0 0", fontSize: "0.92rem" }}>{req.description}</p>
                </div>
                {openForm !== req.id && (
                  <Button size="sm" variant="primary" onClick={() => setOpenForm(req.id)}>Submit estimate</Button>
                )}
              </div>

              {openForm === req.id && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (₹)</label>
                      <input className="form-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2400" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Turnaround (days)</label>
                      <input className="form-input" type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="3" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Note to owner</label>
                    <textarea className="form-textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What you'll do and why" />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Button variant="primary" onClick={() => handleSubmit(req.id)}>Send estimate</Button>
                    <Button variant="ghost" onClick={() => setOpenForm(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}