import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyItems from "./pages/MyItems";
import CreateItem from "./pages/CreateItem";
import ItemDetails from "./pages/ItemDetails";
import RepairRequests from "./pages/RepairRequests";
import RepairRequestDetails from "./pages/RepairRequestDetails";
import Profile from "./pages/Profile";

import RepairerDashboard from "./pages/RepairerDashboard";
import AvailableRequests from "./pages/AvailableRequests";
import MyJobs from "./pages/MyJobs";
import JobDetails from "./pages/JobDetails";
import RepairerProfile from "./pages/RepairerProfile";
import RepairCategory from "./pages/RepairCategory";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Customer dashboard */}
        <Route element={<DashboardLayout role="customer" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/repair-requests" element={<RepairRequests />} />
          <Route path="/repair-requests/:id" element={<RepairRequestDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Repairer dashboard */}
        <Route element={<DashboardLayout role="repairer" />}>
          <Route path="/repairer/dashboard" element={<RepairerDashboard />} />
          <Route path="/repairer/requests" element={<AvailableRequests />} />
          <Route path="/repairer/jobs" element={<MyJobs />} />
          <Route path="/repairer/jobs/:id" element={<JobDetails />} />
          <Route path="/repairer/profile" element={<RepairerProfile />} />
        </Route>

        <Route
  path="/repairs/:category"
  element={<RepairCategory />}
/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}