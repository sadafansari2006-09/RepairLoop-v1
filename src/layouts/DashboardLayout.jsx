import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ role = "customer" }) {
  return (
    <div>
      <Navbar />
      <div className="dashboard-shell">
        <Sidebar role={role} />
        <div className="dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}