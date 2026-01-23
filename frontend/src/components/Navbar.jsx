import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import favicon from "./favicon3.png";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  /* ================= THEME STATE ================= */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  /* APPLY THEME GLOBALLY */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* LOAD USER */
  useEffect(() => {
    const loadUser = () => {
      apiClient.get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    };

    loadUser();
    window.addEventListener("profile-updated", loadUser);
    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("globetrooter_token");
    setOpen(false);
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav style={styles.nav}>
      {/* INJECTED ANIMATIONS FOR SUPER APP LOGO */}
      <style>{`
        @keyframes logo-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        .brand-container:hover .logo-icon-wrapper {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 0 20px var(--primary);
        }
        .brand-container:hover .brand-text {
          color: var(--primary) !important;
          transform: translateX(4px);
        }
      `}</style>

      <div style={styles.navContainer}>
        {/* BRAND AREA WITH HOVER CLASS */}
        <div 
          className="brand-container" 
          style={styles.brand} 
          onClick={() => navigate("/")}
        >
          <div className="logo-icon-wrapper" style={styles.logoIcon}>
            {/* REPLACE THIS URL WITH YOUR LOGO IMAGE PATH */}
            <img 
              src={favicon} 
              alt="Safarify" 
              style={styles.logoImage} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'S';
              }}
            />
          </div>
          <span className="brand-text" style={styles.brandText}>
            Safa<span style={styles.brandAccent}>rify</span>
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.rightArea}>
          {/* 🌗 ANIMATED THEME TOGGLE */}
          <div
            style={styles.themeSwitch}
            onClick={toggleTheme}
            role="button"
            aria-label="Toggle theme"
          >
            <div
              style={{
                ...styles.switchThumb,
                transform:
                  theme === "dark" ? "translateX(0)" : "translateX(26px)",
              }}
            >
              <span style={styles.icon}>
                {theme === "dark" ? "🌙" : "🌞"}
              </span>
            </div>
          </div>

          {/* PROFILE */}
          <div style={styles.profileArea}>
            <div
              style={{
                ...styles.avatar,
                border: open
                  ? "2px solid var(--primary)"
                  : "2px solid var(--border)",
              }}
              onClick={() => setOpen(!open)}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="avatar" style={styles.img} />
              ) : (
                <span style={styles.initials}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            {open && (
              <>
                <div style={styles.backdrop} onClick={() => setOpen(false)} />
                <div style={styles.dropdown}>
                  <div style={styles.userHeader}>
                    <p style={styles.userName}>{user?.name}</p>
                    <p style={styles.userEmail}>{user?.email}</p>
                  </div>
                  <div style={styles.divider} />
                  <div
                    style={styles.item}
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                  >
                    ⚙️ Settings
                  </div>
                  <div style={styles.divider} />
                  <div style={styles.logoutItem} onClick={logout}>
                    🚪 Log Out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ================= STYLES ================= */

const styles = {
  nav: {
    height: "80px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },

  navContainer: {
    maxWidth: "1200px",
    height: "100%",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    background: "var(--primary)",
    borderRadius: "14px", // iOS-style Squircle
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "900",
    fontSize: "22px",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  brandText: {
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--text-primary)",
    transition: "all 0.3s ease",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "var(--primary)",
  },

  rightArea: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  /* ===== THEME SWITCH ===== */
  themeSwitch: {
    width: "52px",
    height: "28px",
    borderRadius: "999px",
    background: "var(--border)",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s ease",
    display: "flex",
    alignItems: "center",
    padding: "2px",
  },

  switchThumb: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "var(--surface)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: "14px",
    pointerEvents: "none",
  },

  /* ===== PROFILE ===== */
  profileArea: {
    position: "relative",
  },

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  initials: {
    fontWeight: "700",
    color: "var(--text-primary)",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  backdrop: {
    position: "fixed",
    inset: 0,
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "60px",
    width: "220px",
    background: "var(--surface)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "10px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
  },

  userHeader: { padding: "12px" },
  userName: { fontWeight: "700", color: "var(--text-primary)" },
  userEmail: { fontSize: "12px", color: "var(--text-secondary)" },
  divider: { height: "1px", background: "var(--border)", margin: "8px 0" },
  item: { padding: "10px 12px", cursor: "pointer", borderRadius: "8px", color: "var(--text-primary)" },
  logoutItem: { padding: "10px 12px", cursor: "pointer", borderRadius: "8px", color: "#EF4444" },
};

export default Navbar;