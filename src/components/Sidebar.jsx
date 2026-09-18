import { NavLink } from "react-router-dom";

const customerLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-items", label: "My items" },
  { to: "/create-item", label: "Report broken item" },
  { to: "/repair-requests", label: "Repair requests" },
  { to: "/profile", label: "Profile" },
];

const repairerLinks = [
  { to: "/repairer/dashboard", label: "Dashboard" },
  { to: "/repairer/requests", label: "Available requests" },
  { to: "/repairer/jobs", label: "My jobs" },
  { to: "/repairer/profile", label: "Profile" },
];

export default function Sidebar({ role = "customer" }) {
  const links = role === "repairer" ? repairerLinks : customerLinks;
  return (
    <aside className="sidebar">
      <div className="sidebar-group">
        <div className="sidebar-label">{role === "repairer" ? "Repairer" : "Menu"}</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}