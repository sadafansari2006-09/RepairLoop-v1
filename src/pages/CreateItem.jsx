import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

const categories = [
  "Electronics",
  "Bicycle",
  "Camera",
  "Furniture",
  "Clothing & Textiles",
  "Appliance",
  "Other",
];

export default function CreateItem() {
  const { addItem, createRepairRequest } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoDataUrl(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Get the current logged-in user's session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to report an item.");
      }

      // Send the item + authentication token to the backend
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          itemName: name,
          category: category,
          description: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save the repair item."
        );
      }

      console.log("Item created:", data);

      // Get the real item created in Supabase
      const createdItem = data.item;

      if (!createdItem) {
        throw new Error("Item was created but no item data was returned.");
      }

      // Create a real repair request
      const requestResponse = await fetch(
        "http://localhost:5000/api/repair-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            itemId: createdItem.id,
          }),
        }
      );

      const requestData = await requestResponse.json();

      if (!requestResponse.ok) {
        throw new Error(
          requestData.message || "Failed to create repair request."
        );
      }

      console.log("Repair request created:", requestData);

      // Keep the existing frontend state working temporarily
      addItem({
        name,
        category,
        description,
        image: photoDataUrl || undefined,
      });

      createRepairRequest({
        itemId: createdItem.id,
      });

      // Go to My Items after successful submission
      navigate("/my-items");
    } catch (err) {
      console.error("Submit error:", err);

      setError(
        err.message ||
          "Could not submit the repair request. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Report a broken item</h1>

          <p>
            Tell us what's wrong and repairers nearby will send estimates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Item name</label>

          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dell Inkspire Laptop"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>

          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Describe the problem</label>

          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's broken, when it started, and anything a repairer should know."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photos</label>

          <div
            className="upload-box"
            onClick={() => fileInputRef.current.click()}
          >
            {photoDataUrl
              ? "Photo selected — click to change"
              : "Click to upload a photo of the damage"}
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
              <img
                src={photoDataUrl}
                alt="Selected preview"
                className="upload-thumb-img"
              />
            </div>
          )}

          <div className="form-hint">
            Clear photos help repairers give more accurate estimates.
          </div>
        </div>

        {error && (
          <p style={{ color: "#b4533c", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit repair request"}
        </Button>
      </form>
    </div>
  );
}