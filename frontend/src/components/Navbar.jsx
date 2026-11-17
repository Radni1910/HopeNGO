
import NotificationBell from "./NotificationBell";

export default function Navbar({ onMenu }) {
  const user = JSON.parse(localStorage.getItem("ngoUser") || "{}");

  return (
    <header className="navbar">
      <button className="menu" onClick={onMenu}>
        ☰
      </button>

      <div className="navbar-title">
        <h2>NGO Management System</h2>
        <p>Making a difference, one step at a time</p>
      </div>

      <div className="navbar-actions">
        <NotificationBell />

        <div className="user">
          <div className="avatar">
            {(user.username || "A")[0].toUpperCase()}
          </div>
          <span>{user.username || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
