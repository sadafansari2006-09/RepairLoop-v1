import { useState, useRef, useEffect } from "react";
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Make sure the selected file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Keep upload size reasonable
    if (file.size > 50 * 1024 * 1024) {
      setError("Image must be smaller than 50 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // 1. Get logged-in user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "You must be logged in to report an item."
        );
      }

      // 2. Upload image to Supabase Storage
      let imageUrl = null;

      if (selectedFile) {
        const fileExtension =
          selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${session.user.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("repair-images")
          .upload(fileName, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        // 3. Get permanent public URL
        const { data: publicUrlData } = supabase.storage
          .from("repair-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // 4. Create item in backend
      const response = await fetch(
        "http://localhost:5000/api/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            itemName: name,
            category,
            description,
            imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save the repair item."
        );
      }

      console.log("Item created:", data);

      const createdItem = data.item;

      if (!createdItem) {
        throw new Error(
          "Item was created but no item data was returned."
        );
      }

      // 5. Create repair request
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
          requestData.message ||
            "Failed to create repair request."
        );
      }

      console.log(
        "Repair request created:",
        requestData
      );

      // 6. Keep existing frontend context in sync temporarily
      addItem({
        name,
        category,
        description,
        image: imageUrl || undefined,
      });

      createRepairRequest({
        itemId: createdItem.id,
      });

      // 7. Go to My Items
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
            Tell us what's wrong and repairers nearby
            will send estimates.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card"
      >
        {/* Item name */}
        <div className="form-group">
          <label className="form-label">
            Item name
          </label>

          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dell Inspiron Laptop"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">
            Category
          </label>

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

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Describe the problem
          </label>

          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="What's broken, when it started, and anything a repairer should know."
            required
          />
        </div>

        {/* Photos */}
        <div className="form-group">
          <label className="form-label">
            Photos
          </label>

          <div
            className="upload-box"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            {photoPreview
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

          {photoPreview && (
            <div className="upload-thumbs">
              <img
                src={photoPreview}
                alt="Selected repair item"
                className="upload-thumb-img"
              />
            </div>
          )}

          <div className="form-hint">
            Clear photos help repairers give more
            accurate estimates.
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              color: "#b4533c",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit repair request"}
        </Button>
      </form>
    </div>
  );
}