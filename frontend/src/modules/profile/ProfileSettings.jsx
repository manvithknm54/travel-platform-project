import { useEffect, useRef, useState } from "react";
import apiClient from "../../services/apiClient";

function ProfileSettings() {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState({});
  const [savedImage, setSavedImage] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [imageEdit, setImageEdit] = useState(false);

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    apiClient.get("/users/me").then((res) => {
      setProfile(res.data);
      setSavedImage(res.data.profileImage || "");
    });
  }, []);

  /* ---------- PROFILE IMAGE ---------- */

  const openImageOptions = () => {
    setTempImage(savedImage);
    setImageEdit(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setTempImage(reader.result);
    reader.readAsDataURL(file);
  };

  const saveImage = async () => {
    await apiClient.put("/users/profile", {
      profileImage: tempImage || null,
    });

    setSavedImage(tempImage);
    setImageEdit(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  /* ---------- NAME ---------- */

  const saveName = async () => {
    await apiClient.put("/users/profile", { name: profile.name });
    setEditName(false);
  };

  /* ---------- EMAIL ---------- */

  const saveEmail = async () => {
    await apiClient.put("/users/profile", { email: profile.email });
    setEditEmail(false);
  };

  /* ---------- PASSWORD ---------- */

  const openPasswordEdit = () => {
    setShowPasswordFields(true);
    setPasswordMsg("");
    setPasswordSuccess("");
  };

  const updatePassword = async () => {
    setPasswordMsg("");
    setPasswordSuccess("");

    if (newPwd !== confirmPwd) {
      setPasswordMsg("New passwords do not match");
      return;
    }

    try {
      await apiClient.put("/users/change-password", {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });

      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setShowPasswordFields(false);
      setPasswordSuccess("Password updated successfully");
    } catch (err) {
      setPasswordMsg(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Account Settings</h2>

      {/* ================= PROFILE IMAGE ================= */}
      <section>
        <h3>Profile Picture</h3>
        <p>Click the image to manage your profile picture.</p>

        <div style={styles.avatar} onClick={openImageOptions}>
          {(imageEdit ? tempImage : savedImage) ? (
            <img
              src={imageEdit ? tempImage : savedImage}
              alt="avatar"
              style={styles.img}
            />
          ) : (
            <span>{profile.name?.[0]?.toUpperCase()}</span>
          )}
        </div>

        {imageEdit && (
          <>
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={handleImage}
            />

            <div style={styles.actionRow}>
              <button onClick={() => fileRef.current.click()}>
                Change Photo
              </button>

              {(tempImage || savedImage) && (
                <button
                  onClick={() => setTempImage("")}
                  style={styles.danger}
                >
                  Remove Photo
                </button>
              )}

              <button onClick={saveImage}>Save Changes</button>

              <button
                onClick={() => {
                  setTempImage(savedImage);
                  setImageEdit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

      {/* ================= NAME ================= */}
      <section>
        <h3>Name</h3>
        {!editName ? (
          <button onClick={() => setEditName(true)}>Change Name</button>
        ) : (
          <>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
            <button onClick={saveName}>Save</button>
          </>
        )}
      </section>

      {/* ================= EMAIL ================= */}
      <section>
        <h3>Email</h3>
        {!editEmail ? (
          <button onClick={() => setEditEmail(true)}>Change Email</button>
        ) : (
          <>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <button onClick={saveEmail}>Save</button>
          </>
        )}
      </section>

      {/* ================= PASSWORD ================= */}
      <section>
        <h3>Password</h3>

        {/* messages ALWAYS visible */}
        {passwordMsg && <p style={styles.error}>{passwordMsg}</p>}
        {passwordSuccess && (
          <p style={styles.success}>{passwordSuccess}</p>
        )}

        {!showPasswordFields ? (
          <button onClick={openPasswordEdit}>Change Password</button>
        ) : (
          <>
            <p>Update your account password.</p>

            <input
              type="password"
              placeholder="Current Password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />

            <div style={styles.actionRow}>
              <button onClick={updatePassword}>Update Password</button>
              <button
                onClick={() => {
                  setShowPasswordFields(false);
                  setOldPwd("");
                  setNewPwd("");
                  setConfirmPwd("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
    maxWidth: "520px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    cursor: "pointer",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
  },
  error: {
    color: "#dc2626",
  },
  success: {
    color: "limegreen",
  },
};

export default ProfileSettings;
