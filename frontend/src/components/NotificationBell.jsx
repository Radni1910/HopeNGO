
import { useEffect, useState } from "react";
import { get, put } from "../api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  const markAsRead = async (id) => {
    try {
      await put(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => {
          setOpen(!open);
          loadNotifications();
        }}
        title="Notifications"
      >
        <i className="bi bi-bell"></i>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-heading">
            <h3>Notifications</h3>
            <span>{unreadCount} unread</span>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notification-item ${
                    item.is_read ? "read" : "unread"
                  }`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="notification-icon">
                    <i className="bi bi-bell"></i>
                  </div>

                  <div className="notification-content">
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>
                      {new Date(item.created_at).toLocaleString("en-IN")}
                    </small>
                  </div>

                  {!item.is_read && (
                    <span className="unread-dot"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <i className="bi bi-bell-slash"></i>
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
