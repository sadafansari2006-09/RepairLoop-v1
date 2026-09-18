import { createContext, useContext, useEffect, useState } from "react";
import { initialItems, initialRequests, repairers, currentUser, currentRepairer } from "../data/mockData";

const AppContext = createContext(null);

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => load("rl_role", null)); // "customer" | "repairer" | null
  const [items, setItems] = useState(() => load("rl_items", initialItems));
  const [requests, setRequests] = useState(() => load("rl_requests", initialRequests));
  const [userAvatar, setUserAvatar] = useState(() => load("rl_user_avatar", null));
  const [repairerAvatar, setRepairerAvatar] = useState(() => load("rl_repairer_avatar", null));

  useEffect(() => localStorage.setItem("rl_role", JSON.stringify(role)), [role]);
  useEffect(() => localStorage.setItem("rl_items", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("rl_requests", JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem("rl_user_avatar", JSON.stringify(userAvatar)), [userAvatar]);
  useEffect(() => localStorage.setItem("rl_repairer_avatar", JSON.stringify(repairerAvatar)), [repairerAvatar]);

  function login(asRole) {
    setRole(asRole);
  }

  function logout() {
    setRole(null);
  }

  function addItem(item) {
    const newItem = {
      id: `i${Date.now()}`,
      status: "active",
      photoClass: "photo-generic",
      ...item,
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }

  function createRepairRequest({ itemId }) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return null;
    const newRequest = {
      id: `req${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      image: item.image,
      photoClass: item.photoClass,
      description: item.description,
      status: "open",
      createdAt: new Date().toISOString().slice(0, 10),
      chosenRepairerId: null,
      estimates: [],
      timeline: [{ label: "Request submitted", date: "Just now", state: "current" }],
    };
    setRequests((prev) => [newRequest, ...prev]);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status: "estimating" } : i)));
    return newRequest;
  }

  function submitEstimate(requestId, estimate) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const nextEstimates = [...r.estimates, { id: `e${Date.now()}`, ...estimate }];
        const hadNone = r.estimates.length === 0;
        return {
          ...r,
          status: "estimating",
          estimates: nextEstimates,
          timeline: hadNone
            ? [...r.timeline, { label: "Estimates received", date: "Just now", state: "current" }]
            : r.timeline,
        };
      })
    );
  }

  function chooseRepairer(requestId, estimateId) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const est = r.estimates.find((e) => e.id === estimateId);
        return {
          ...r,
          status: "in_progress",
          chosenRepairerId: est?.repairerId ?? null,
          timeline: [
            ...r.timeline,
            { label: `Repairer chosen — ${est?.repairerName ?? ""}`, date: "Just now", state: "done" },
            { label: "Repair in progress", date: "Just now", state: "current" },
          ],
        };
      })
    );
    const req = requests.find((r) => r.id === requestId);
    if (req) setItems((prev) => prev.map((i) => (i.id === req.itemId ? { ...i, status: "in_progress" } : i)));
  }

  function updateJobStatus(requestId, nextStatus, label) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: nextStatus,
          timeline: [...r.timeline, { label, date: "Just now", state: nextStatus === "completed" ? "done" : "current" }],
        };
      })
    );
    const req = requests.find((r) => r.id === requestId);
    if (req) setItems((prev) => prev.map((i) => (i.id === req.itemId ? { ...i, status: nextStatus } : i)));
  }

  function updateUserAvatar(dataUrl) {
    setUserAvatar(dataUrl);
  }

  function updateRepairerAvatar(dataUrl) {
    setRepairerAvatar(dataUrl);
  }

  const value = {
    role,
    login,
    logout,
    user: currentUser,
    repairer: currentRepairer,
    repairers,
    items,
    requests,
    userAvatar,
    repairerAvatar,
    addItem,
    createRepairRequest,
    submitEstimate,
    chooseRepairer,
    updateJobStatus,
    updateUserAvatar,
    updateRepairerAvatar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}