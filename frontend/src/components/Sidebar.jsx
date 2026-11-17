import { NavLink, useNavigate } from "react-router-dom";
export default function Sidebar({ open, onClose }) {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("ngoUser");
    nav("/login");
  };
  const links = [
    ["/dashboard", "Dashboard", "▦"],
    ["/donors", "Donors", "◉"],
    ["/donations", "Donations", "₹"],
    ["/volunteers", "Volunteers", "♙"],
    ["/events", "Events", "▣"],
    ["/beneficiaries", "Beneficiaries", "♡"],
    ["/reports", "Reports", "▤"],
  ];
  return (
    <aside className={"sidebar " + (open ? "open" : "")}>
      <div className="brand">
        <div className="brand-icon">🕊</div>
        <div>
          <b>HopeNGO</b>
          <small>Management System</small>
        </div>
      </div>
      <nav>
        {links.map(([to, label, icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <button className="logout" onClick={logout}>
        ↪ Logout
      </button>
    </aside>
  );
}
