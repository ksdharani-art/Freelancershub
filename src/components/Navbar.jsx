import { useState } from "react";
import { useApp } from "../context";
import { Bell, Briefcase, LogOut, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout, notifications, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigateTo("#/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top" style={styles.nav}>
      <div className="container px-4">
        {/* Brand Logo */}
        <div 
          onClick={() => navigateTo(user.role === "client" ? "#/dashboard/client" : user.role === "admin" ? "#/admin" : "#/projects")} 
          style={styles.logoContainer}
        >
          <div style={styles.logoBadge}>
            <Briefcase size={16} color="#10192E" strokeWidth={2.5} />
          </div>
          <span style={styles.logoText}>FreelanceHub</span>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          style={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={20} color="#fff" /> : <Menu size={20} color="#fff" />}
        </button>

        {/* Navbar Links & Widgets */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} style={mobileMenuOpen ? styles.mobileCollapse : {}}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={styles.navLinks}>
            {user.role === "freelancer" && (
              <>
                <li className="nav-item">
                  <span onClick={() => navigateTo("#/projects")} style={styles.navLink}>
                    Browse Projects
                  </span>
                </li>
                <li className="nav-item">
                  <span onClick={() => navigateTo("#/dashboard/freelancer")} style={styles.navLink}>
                    My Dashboard
                  </span>
                </li>
              </>
            )}
            {user.role === "client" && (
              <>
                <li className="nav-item">
                  <span onClick={() => navigateTo("#/dashboard/client")} style={styles.navLink}>
                    Client Dashboard
                  </span>
                </li>
                <li className="nav-item">
                  <span onClick={() => navigateTo("#/projects")} style={styles.navLink}>
                    View Market
                  </span>
                </li>
              </>
            )}
            {user.role === "admin" && (
              <li className="nav-item">
                <span onClick={() => navigateTo("#/admin")} style={styles.navLink}>
                  Admin Panel
                </span>
              </li>
            )}
          </ul>

          <div style={styles.widgetsContainer}>
            {/* Demo Reset Button */}
            {/* reset demo button removed as requested */}

            {/* Notification Center */}
            <div style={styles.relative}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllNotificationsRead();
                }} 
                style={styles.widgetBtn}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div style={styles.notificationsDropdown}>
                  <div style={styles.dropdownHeader}>
                    <span>Notifications</span>
                    {unreadCount > 0 && <span style={styles.unreadTag}>{unreadCount} new</span>}
                  </div>
                  <div style={styles.dropdownBody}>
                    {notifications.length === 0 ? (
                      <p style={styles.emptyText}>No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} style={styles.notificationItem}>
                          <div style={styles.notificationDot} />
                          <div>
                            <p style={styles.notificationText}>{notif.text}</p>
                            <span style={styles.notificationTime}>{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile widget */}
            <div style={styles.profileWidget}>
              <div style={styles.avatar}>
                <User size={14} color="#10192E" />
              </div>
              <div className="d-none d-md-block text-start">
                <p style={styles.profileName}>{user.name}</p>
                <span style={styles.roleBadge(user.role)}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#10192E",
    borderColor: "#1E293B",
    padding: "12px 0",
    color: "#fff"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    marginRight: "24px"
  },
  logoBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9A441"
  },
  logoText: {
    fontFamily: "'Fraunces', serif",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "0.02em"
  },
  menuToggle: {
    border: "none",
    background: "transparent",
    padding: "4px",
    display: "none", // Will be shown on mobile via responsive override in main css
    cursor: "pointer"
  },
  mobileCollapse: {
    display: "block",
    width: "100%",
    paddingTop: "12px"
  },
  navLinks: {
    gap: "16px",
    cursor: "pointer"
  },
  navLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#9AA3B5",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.15s ease",
    padding: "6px 8px",
    display: "block"
  },
  widgetsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap"
  },
  resetBtn: {
    fontSize: "11px",
    borderColor: "#D9A441",
    color: "#D9A441",
    borderRadius: "6px"
  },
  relative: {
    position: "relative"
  },
  widgetBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "none",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9AA3B5",
    cursor: "pointer",
    transition: "background 0.15s ease",
    position: "relative"
  },
  badge: {
    position: "absolute",
    top: "-3px",
    right: "-3px",
    backgroundColor: "#B3441C",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "700",
    borderRadius: "99px",
    padding: "2px 6px"
  },
  notificationsDropdown: {
    position: "absolute",
    top: "46px",
    right: "0",
    width: "280px",
    backgroundColor: "#1C253B",
    border: "1px solid #2D3748",
    borderRadius: "10px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
    overflow: "hidden"
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #2D3748",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff"
  },
  unreadTag: {
    backgroundColor: "#B3441C",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "99px"
  },
  dropdownBody: {
    maxHeight: "240px",
    overflowY: "auto",
    padding: "8px 0"
  },
  emptyText: {
    fontSize: "12px",
    color: "#6B7280",
    textAlign: "center",
    padding: "16px 0",
    margin: 0
  },
  notificationItem: {
    display: "flex",
    gap: "10px",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    transition: "background 0.15s",
    cursor: "pointer"
  },
  notificationDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#1F7A5C",
    borderRadius: "99px",
    marginTop: "6px",
    flexShrink: 0
  },
  notificationText: {
    fontSize: "12px",
    color: "#D1D5DB",
    margin: "0 0 2px 0",
    lineHeight: "1.4"
  },
  notificationTime: {
    fontSize: "10px",
    color: "#6B7280"
  },
  profileWidget: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "16px",
    borderLeft: "1px solid #1E293B"
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "99px",
    backgroundColor: "#D9A441",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  profileName: {
    fontSize: "12px",
    fontWeight: "600",
    margin: 0,
    color: "#fff",
    lineHeight: "1.2"
  },
  roleBadge: (role) => ({
    fontSize: "9px",
    fontWeight: "700",
    padding: "1px 5px",
    borderRadius: "4px",
    backgroundColor: role === "client" ? "#1F7A5C" : role === "admin" ? "#6366F1" : "#D9A441",
    color: role === "client" ? "#EAF3EE" : "#fff",
    display: "inline-block",
    marginTop: "2px"
  }),
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#9AA3B5",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    marginLeft: "4px",
    transition: "color 0.15s ease"
  }
};
