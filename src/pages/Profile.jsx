import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [itemsCount, setItemsCount] = useState(0);
  const [completedRepairs, setCompletedRepairs] = useState(0);
  const [memberSince, setMemberSince] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in.");
      }

      const user = session.user;

      // Get real member-since year from Supabase Auth
      setMemberSince(
        new Date(user.created_at).getFullYear()
      );

      // Get profile information
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);
      setAvatarUrl(profileData.avatar_url || null);

      // Get number of items reported
      const { count: itemCount, error: itemsError } =
        await supabase
          .from("items")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("owner_id", user.id);

      if (itemsError) {
        console.error(
          "Error loading item count:",
          itemsError
        );
      } else {
        setItemsCount(itemCount || 0);
      }

      // Get completed repairs
      const {
        count: completedCount,
        error: jobsError,
      } = await supabase
        .from("repair_jobs")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("owner_id", user.id)
        .eq("status", "completed");

      if (jobsError) {
        console.error(
          "Error loading completed repairs:",
          jobsError
        );
      } else {
        setCompletedRepairs(completedCount || 0);
      }
    } catch (err) {
      console.error(
        "Error loading profile:",
        err
      );

      setError(
        err.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Image must be smaller than 50 MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in.");
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        "jpg";

      const filePath = `avatars/${session.user.id}/${crypto.randomUUID()}.${extension}`;

      // Upload profile photo
      const { error: uploadError } =
        await supabase.storage
          .from("repair-images")
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        throw new Error(
          `Photo upload failed: ${uploadError.message}`
        );
      }

      // Get public URL
      const { data: publicUrlData } =
        supabase.storage
          .from("repair-images")
          .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData.publicUrl;

      // Save photo URL to profile
      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            avatar_url: publicUrl,
          })
          .eq("id", session.user.id);

      if (updateError) {
        throw new Error(
          `Failed to save profile photo: ${updateError.message}`
        );
      }

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error(
        "Avatar upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile photo."
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="page-head">
          <div>
            <h1>Profile</h1>
            <p>Loading your account details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="page-head">
          <div>
            <h1>Profile</h1>
            <p>
              Unable to load your account details.
            </p>
          </div>
        </div>

        {error && (
          <p style={{ color: "#b4533c" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p>Your account details.</p>
        </div>
      </div>

      {/* Profile header */}
      <div className="profile-header">
        <div className="avatar-upload">
          <div
            className="avatar"
            style={
              avatarUrl
                ? {
                    backgroundImage: `url(${avatarUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          />

          <button
            type="button"
            className="avatar-edit-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Change photo"}
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
          <h3 style={{ marginBottom: 2 }}>
            {profile.name}
          </h3>

          <p
            style={{
              margin: 0,
              color: "var(--bark-soft)",
            }}
          >
            {profile.email}
          </p>
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

      {/* Account information */}
      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="form-group">
          <label className="form-label">
            Location
          </label>

          <p style={{ margin: 0 }}>
            {profile.location || "Not provided"}
          </p>
        </div>

        <div
          className="form-group"
          style={{ marginBottom: 0 }}
        >
          <label className="form-label">
            Member since
          </label>

          <p style={{ margin: 0 }}>
            {memberSince || "—"}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div
        className="stat-grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div className="stat-card">
          <div className="num">
            {itemsCount}
          </div>

          <div className="label">
            Items reported
          </div>
        </div>

        <div className="stat-card">
          <div className="num">
            {completedRepairs}
          </div>

          <div className="label">
            Repairs completed
          </div>
        </div>
      </div>
    </div>
  );
}