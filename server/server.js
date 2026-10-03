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
       imageUrl,
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
          image_url: imageUrl || null,
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

app.post("/api/estimates", async (req, res) => {
  try {
    const { requestId, amount, message } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    // Make sure the request exists and is still open
    const { data: request, error: requestError } = await supabase
      .from("repair_requests")
      .select("id, status")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    if (request.status !== "open") {
      return res.status(400).json({
        message: "This repair request is no longer open.",
      });
    }

    const { data, error } = await supabase
      .from("estimates")
      .insert([
        {
          request_id: requestId,
          repairer_id: user.id,
          amount: Number(amount),
          message: message || "",
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Estimate insert error:", error);

      return res.status(500).json({
        message: "Failed to save estimate",
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Estimate submitted successfully!",
      estimate: data,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/api/repair-jobs", async (req, res) => {
  try {
    const { requestId, estimateId } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    // Make sure this request belongs to the logged-in owner
    const { data: request, error: requestError } = await supabase
      .from("repair_requests")
      .select("id, owner_id, status")
      .eq("id", requestId)
      .eq("owner_id", user.id)
      .single();

    if (requestError || !request) {
      return res.status(403).json({
        message: "You can only choose a repairer for your own request.",
      });
    }

    if (request.status !== "open") {
      return res.status(400).json({
        message: "This repair request is no longer open.",
      });
    }

    // Get the selected estimate
    const { data: estimate, error: estimateError } = await supabase
      .from("estimates")
      .select("id, request_id, repairer_id, status")
      .eq("id", estimateId)
      .eq("request_id", requestId)
      .single();

    if (estimateError || !estimate) {
      return res.status(404).json({
        message: "Estimate not found.",
      });
    }

    // Create the repair job
    const { data: job, error: jobError } = await supabase
      .from("repair_jobs")
      .insert([
        {
          request_id: requestId,
          repairer_id: estimate.repairer_id,
          owner_id: user.id,
          status: "assigned",
        },
      ])
      .select()
      .single();

    if (jobError) {
      console.error("Repair job insert error:", jobError);

      return res.status(500).json({
        message: "Failed to create repair job.",
        error: jobError.message,
      });
    }

    // Mark selected estimate as accepted
    await supabase
      .from("estimates")
      .update({ status: "accepted" })
      .eq("id", estimateId);

    // Mark all other estimates for this request as rejected
    await supabase
      .from("estimates")
      .update({ status: "rejected" })
      .eq("request_id", requestId)
      .neq("id", estimateId);

    // Move the repair request into progress
    await supabase
      .from("repair_requests")
      .update({ status: "in_progress" })
      .eq("id", requestId);

    res.status(201).json({
      message: "Repairer selected successfully!",
      job,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/api/repairer/jobs", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    // Get jobs assigned to this repairer
    const { data: jobs, error: jobsError } = await supabase
      .from("repair_jobs")
      .select("*")
      .eq("repairer_id", user.id)
      .order("created_at", { ascending: false });

    if (jobsError) {
      console.error("Repairer jobs error:", jobsError);

      return res.status(500).json({
        message: "Failed to load repairer jobs.",
        error: jobsError.message,
      });
    }

    if (!jobs || jobs.length === 0) {
      return res.json({
        jobs: [],
      });
    }

    // Get the related repair requests
    const requestIds = jobs.map((job) => job.request_id);

    const { data: requests, error: requestsError } =
      await supabase
        .from("repair_requests")
        .select("*")
        .in("id", requestIds);

    if (requestsError) {
      throw requestsError;
    }

    // Get the related items
    const itemIds = requests
      .map((request) => request.item_id)
      .filter(Boolean);

    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .in("id", itemIds);

    if (itemsError) {
      throw itemsError;
    }

    const formattedJobs = jobs.map((job) => {
      const request = requests?.find(
        (request) => request.id === job.request_id
      );

      const item = items?.find(
        (item) => item.id === request?.item_id
      );

      return {
        id: job.id,
        requestId: job.request_id,
        itemName: item?.item_name || "Unknown item",
        category: item?.category || "Other",
        description: item?.description || "",
        image: item?.image_url || undefined,
        status: job.status,
        createdAt: new Date(
          job.created_at
        ).toLocaleDateString("en-IN"),
      };
    });

    res.json({
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/api/repairer/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    const { data: job, error: jobError } = await supabase
      .from("repair_jobs")
      .select("*")
      .eq("id", id)
      .eq("repairer_id", user.id)
      .single();

    if (jobError || !job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    const { data: request, error: requestError } =
      await supabase
        .from("repair_requests")
        .select("*")
        .eq("id", job.request_id)
        .single();

    if (requestError || !request) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", request.item_id)
      .single();

    if (itemError || !item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    const { data: estimate } = await supabase
      .from("estimates")
      .select("*")
      .eq("request_id", job.request_id)
      .eq("repairer_id", user.id)
      .eq("status", "accepted")
      .maybeSingle();

    res.json({
      job,
      request,
      item,
      estimate: estimate || null,
    });
  } catch (error) {
    console.error("Job details error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


app.patch("/api/repairer/jobs/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = [
      "assigned",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid job status.",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    const { data: job, error: jobError } = await supabase
      .from("repair_jobs")
      .select("*")
      .eq("id", id)
      .eq("repairer_id", user.id)
      .single();

    if (jobError || !job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    const { data: updatedJob, error: updateError } =
      await supabase
        .from("repair_jobs")
        .update({
          status,
          notes: notes || null,
        })
        .eq("id", id)
        .eq("repairer_id", user.id)
        .select()
        .single();

    if (updateError) {
      console.error("Job status update error:", updateError);

      return res.status(500).json({
        message: "Failed to update job status.",
        error: updateError.message,
      });
    }

    // Keep the owner's repair request status synchronized.
    let requestStatus = "in_progress";

    if (status === "completed") {
      requestStatus = "completed";
    }

    await supabase
      .from("repair_requests")
      .update({
        status: requestStatus,
      })
      .eq("id", job.request_id);

    res.json({
      message: "Job status updated successfully!",
      job: updatedJob,
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