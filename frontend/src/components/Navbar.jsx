import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      apiClient.get("/users/me").then((res) => setUser(res.data));
    };

    loadUser();

    // 🔥 listen for profile updates
    window.addEventListener("profile-updated", loadUser);

    return () => {
      window.removeEventListener("profile-updated", loadUser);
    };
  }, []);

  const closeAndNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("globetrooter_token");
    setOpen(false);
    navigate("/login");
  };

  const avatarContent = user?.profileImage ? (
    <img src={user.profileImage} alt="avatar" style={styles.img} />
  ) : (
    user?.name?.[0]?.toUpperCase() || "U"
  );

  return (
    <div style={styles.nav}>
      <h3 style={styles.brand} onClick={() => navigate("/")}>
        GlobeTrotter
      </h3>

      <div style={styles.profile}>
        <div style={styles.avatar} onClick={() => setOpen(!open)}>
          {avatarContent}
        </div>

        {open && (
          <div style={styles.dropdown}>
            <div
              style={styles.item}
              onClick={() => closeAndNavigate("/profile")}
            >
              Settings
            </div>
            <div style={styles.item} onClick={logout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 24px",
  },
  brand: {
    cursor: "pointer",
    fontWeight: "600",
    color: "#222",
  },
  profile: {
    position: "relative",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    fontWeight: "600",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "45px",
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  },
  item: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#333",
  },
};

export default Navbar;
