const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// ===============================
// Health check
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    message: "RepairLoop backend is running!",
  });
});


// ===============================
// Test Supabase connection
// ===============================

app.get("/api/test-supabase", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);

    return res.status(500).json({
      message: "Supabase connection failed",
      error: error.message,
    });
  }

  res.json({
    message: "Supabase connection successful!",
    data,
  });
});


// ===============================
// Create repair item
// ===============================

app.post("/api/items", async (req, res) => {
  try {
    const {
      itemName,
      category,
      description,
    } = req.body;

    // Get authentication token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    // Save item
    const { data, error } = await supabase
      .from("items")
      .insert([
        {
          owner_id: user.id,
          item_name: itemName,
          category: category,
          description: description,
          status: "open",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase item insert error:", error);

      return res.status(500).json({
        message: "Failed to save repair item",
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Repair item saved successfully!",
      item: data,
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// Create repair request
// ===============================

app.post("/api/repair-requests", async (req, res) => {
  try {
    const { itemId } = req.body;

    // Get authentication token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    // Make sure the item belongs to this user
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id, owner_id")
      .eq("id", itemId)
      .eq("owner_id", user.id)
      .single();

    if (itemError || !item) {
      return res.status(403).json({
        message: "You can only create a request for your own item.",
      });
    }

    // Create repair request
    const { data, error } = await supabase
      .from("repair_requests")
      .insert([
        {
          item_id: itemId,
          owner_id: user.id,
          status: "open",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Repair request insert error:", error);

      return res.status(500).json({
        message: "Failed to create repair request",
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Repair request created successfully!",
      request: data,
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// Start server
// ===============================

app.listen(PORT, () => {
  console.log(
    `RepairLoop server running on http://localhost:${PORT}`
  );
});