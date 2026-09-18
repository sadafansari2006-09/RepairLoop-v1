import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";

const categories = ["Electronics", "Bicycle", "Camera", "Furniture", "Clothing & Textiles", "Appliance", "Other"];

export default function CreateItem() {
  const { addItem, createRepairRequest } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const item = addItem({ name, category, description, image: photoDataUrl || undefined });
    createRepairRequest({ itemId: item.id });
    navigate("/my-items");
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Report a broken item</h1>
          <p>Tell us what's wrong and repairers nearby will send estimates.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Item name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dell Inkspire Laptop" required />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Describe the problem</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's broken, when it started, and anything a repairer should know." required />
        </div>

        <div className="form-group">
          <label className="form-label">Photos</label>
          <div className="upload-box" onClick={() => fileInputRef.current.click()}>
            {photoDataUrl ? "Photo selected — click to change" : "Click to upload a photo of the damage"}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {photoDataUrl && (
            <div className="upload-thumbs">
              <img src={photoDataUrl} alt="Selected preview" className="upload-thumb-img" />
            </div>
          )}
          <div className="form-hint">Clear photos help repairers give more accurate estimates.</div>
        </div>

        <Button type="submit" variant="primary">Submit repair request</Button>
      </form>
    </div>
  );
}