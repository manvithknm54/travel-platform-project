import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      apiClient.get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    };

    loadUser();

    // Listen for profile updates to refresh avatar/name instantly
    window.addEventListener("profile-updated", loadUser);
    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("globetrooter_token");
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Left: Brand / Logo */}
        <div style={styles.brand} onClick={() => navigate("/")}>
          <div style={styles.logoIcon}>G</div>
          <span style={styles.brandText}>
            Globe<span style={styles.brandAccent}>Trotter</span>
          </span>
        </div>

        {/* Right: Profile Dropdown */}
        <div style={styles.profileArea}>
          <div
            style={{
              ...styles.avatar,
              border: open ? "2px solid #6366F1" : "2px solid rgba(255,255,255,0.1)",
            }}
            onClick={() => setOpen(!open)}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="avatar" style={styles.img} />
            ) : (
              <span style={styles.initials}>{user?.name?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>

          {open && (
            <>
              {/* Clickable backdrop to close dropdown when clicking outside */}
              <div style={styles.backdrop} onClick={() => setOpen(false)} />
              
              <div style={styles.dropdown}>
                <div style={styles.userHeader}>
                  <p style={styles.userName}>{user?.name || "Traveler"}</p>
                  <p style={styles.userEmail}>{user?.email || "Account Active"}</p>
                </div>
                
                <div style={styles.divider} />
                
                <div 
                  style={styles.item} 
                  onClick={() => { setOpen(false); navigate("/profile"); }}
                >
                  <span style={styles.icon}>⚙️</span> Settings
                </div>
                
                <div style={styles.divider} />
                
                <div style={styles.logoutItem} onClick={logout}>
                  <span style={styles.icon}>🚪</span> Log Out
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ================= PREMIUM STYLES ================= */

const styles = {
  nav: {
    height: "72px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(2, 6, 23, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontFamily: "'Inter', sans-serif",
  },
  navContainer: {
    maxWidth: "1200px",
    height: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: "18px",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
  },
  brandText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  brandAccent: {
    color: "#818cf8",
  },
  profileArea: {
    position: "relative",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "14px", // Matches the "Squircle" design of the app
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  initials: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "56px",
    width: "220px",
    background: "#0f172a",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    padding: "8px",
    zIndex: 100,
  },
  userHeader: {
    padding: "12px 16px",
  },
  userName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },
  userEmail: {
    fontSize: "12px",
    color: "#64748b",
    margin: "2px 0 0 0",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "6px 0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    fontSize: "14px",
    color: "#cbd5e1",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "background 0.2s",
  },
  logoutItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    fontSize: "14px",
    color: "#f87171", // Soft red for logout
    cursor: "pointer",
    borderRadius: "10px",
    transition: "background 0.2s",
  },
  icon: {
    fontSize: "16px",
  },
};

export default Navbar;