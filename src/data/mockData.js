// Mock data — swap for real API calls once the backend lands.
import heroImg from "../assets/images/hero-repair.jpg";
import laptopImg from "../assets/images/laptop.jpg";
import bicycleImg from "../assets/images/bicycle.jpg";
import cameraImg from "../assets/images/camera.jpg";
import workshopImg from "../assets/images/repair-workshop.jpg";

export { heroImg, workshopImg };

export const currentUser = {
  id: "u1",
  name: "Asha Rao",
  email: "asha@example.com",
  location: "Mumbai, Maharashtra",
  memberSince: "2024",
};

export const currentRepairer = {
  id: "r1",
  name: "Vikram Shah",
  shopName: "Shah & Sons Repairs",
  specialty: "Electronics & Small Appliances",
  location: "Mumbai, Maharashtra",
  rating: 4.8,
  jobsCompleted: 132,
  memberSince: "2021",
};

export const repairers = [
  { id: "r1", name: "Vikram Shah", shopName: "Shah & Sons Repairs", specialty: "Electronics", rating: 4.8, distance: "1.2 km", yearsActive: 9 },
  { id: "r2", name: "Meera Joshi", shopName: "The Fixing Room", specialty: "Bicycles & Metalwork", rating: 4.9, distance: "2.4 km", yearsActive: 6 },
  { id: "r3", name: "Farhan Ali", shopName: "Lens & Latch Repairs", specialty: "Cameras & Optics", rating: 4.6, distance: "3.1 km", yearsActive: 4 },
  { id: "r4", name: "Deepa Nair", shopName: "Second Life Studio", specialty: "Furniture & Woodwork", rating: 4.9, distance: "0.8 km", yearsActive: 11 },
];

export const initialItems = [
  {
    id: "i1",
    name: "Dell Inkspire Laptop",
    category: "Electronics",
    description: "Won't power on since it was dropped. Screen was fine before that. Battery light flickers once then nothing.",
    image: laptopImg,
    photoClass: "photo-laptop",
    status: "in_progress",
  },
  {
    id: "i2",
    name: "Hercules Roadster Bicycle",
    category: "Bicycle",
    description: "Chain keeps slipping and the rear brake cable snapped. Frame is otherwise in good shape.",
    image: bicycleImg,
    photoClass: "photo-bicycle",
    status: "estimating",
  },
  {
    id: "i3",
    name: "Canon AE-1 Film Camera",
    category: "Camera",
    description: "Shutter sticks at slower speeds. Light seals look worn and there's a faint rattle inside.",
    image: cameraImg,
    photoClass: "photo-camera",
    status: "completed",
  },
];

export const initialRequests = [
  {
    id: "req1",
    itemId: "i1",
    itemName: "Dell Inkspire Laptop",
    category: "Electronics",
    image: laptopImg,
    photoClass: "photo-laptop",
    description: "Won't power on since it was dropped. Screen was fine before that. Battery light flickers once then nothing.",
    status: "in_progress",
    createdAt: "2026-08-14",
    chosenRepairerId: "r1",
    estimates: [
      { id: "e1", repairerId: "r1", repairerName: "Vikram Shah — Shah & Sons Repairs", price: 2400, days: 3, message: "Likely a damaged charging board. Can confirm after opening the case." },
      { id: "e2", repairerId: "r5", repairerName: "Circuit Care Mumbai", price: 3100, days: 5, message: "Will run full diagnostics before quoting final parts cost." },
    ],
    timeline: [
      { label: "Request submitted", date: "14 Aug", state: "done" },
      { label: "Estimates received", date: "15 Aug", state: "done" },
      { label: "Repairer chosen — Shah & Sons Repairs", date: "16 Aug", state: "done" },
      { label: "Repair in progress", date: "18 Aug", state: "current" },
      { label: "Ready for pickup", date: "", state: "upcoming" },
    ],
  },
  {
    id: "req2",
    itemId: "i2",
    itemName: "Hercules Roadster Bicycle",
    category: "Bicycle",
    image: bicycleImg,
    photoClass: "photo-bicycle",
    description: "Chain keeps slipping and the rear brake cable snapped. Frame is otherwise in good shape.",
    status: "estimating",
    createdAt: "2026-09-10",
    chosenRepairerId: null,
    estimates: [
      { id: "e3", repairerId: "r2", repairerName: "Meera Joshi — The Fixing Room", price: 850, days: 2, message: "Straightforward — new chain and brake cable, quick turnaround." },
    ],
    timeline: [
      { label: "Request submitted", date: "10 Sep", state: "done" },
      { label: "Estimates received", date: "11 Sep", state: "current" },
      { label: "Choose a repairer", date: "", state: "upcoming" },
      { label: "Repair in progress", date: "", state: "upcoming" },
      { label: "Ready for pickup", date: "", state: "upcoming" },
    ],
  },
  {
    id: "req3",
    itemId: "i3",
    itemName: "Canon AE-1 Film Camera",
    category: "Camera",
    image: cameraImg,
    photoClass: "photo-camera",
    description: "Shutter sticks at slower speeds. Light seals look worn and there's a faint rattle inside.",
    status: "completed",
    createdAt: "2026-07-02",
    chosenRepairerId: "r3",
    estimates: [
      { id: "e4", repairerId: "r3", repairerName: "Farhan Ali — Lens & Latch Repairs", price: 1600, days: 6, message: "Full CLA service — clean, lubricate, adjust, plus new seals." },
    ],
    timeline: [
      { label: "Request submitted", date: "2 Jul", state: "done" },
      { label: "Estimates received", date: "3 Jul", state: "done" },
      { label: "Repairer chosen — Lens & Latch Repairs", date: "3 Jul", state: "done" },
      { label: "Repair in progress", date: "5 Jul", state: "done" },
      { label: "Repaired & collected", date: "11 Jul", state: "done" },
    ],
  },
];