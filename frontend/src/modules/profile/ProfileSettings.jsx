import { useEffect, useRef, useState } from "react";
import apiClient from "../../services/apiClient";

function ProfileSettings() {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState({});
  const [savedImage, setSavedImage] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [imageEdit, setImageEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Modal State

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

  /* ---------- IMAGE LOGIC ---------- */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setImageEdit(true);
    };
    reader.readAsDataURL(file);
  };

  const saveImageChange = async () => {
    await apiClient.put("/users/profile", { profileImage: tempImage || null });
    setSavedImage(tempImage);
    setImageEdit(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const confirmRemovePhoto = async () => {
    await apiClient.put("/users/profile", { profileImage: null });
    setSavedImage("");
    setTempImage("");
    setImageEdit(false);
    setShowConfirm(false); // Close Modal
    window.dispatchEvent(new Event("profile-updated"));
  };

  /* ---------- INFO SAVE LOGIC ---------- */
  const saveName = async () => {
    await apiClient.put("/users/profile", { name: profile.name });
    setEditName(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const saveEmail = async () => {
    await apiClient.put("/users/profile", { email: profile.email });
    setEditEmail(false);
  };

  const updatePassword = async () => {
    setPasswordMsg(""); setPasswordSuccess("");
    if (newPwd !== confirmPwd) { setPasswordMsg("New passwords do not match"); return; }
    try {
      await apiClient.put("/users/change-password", { oldPassword: oldPwd, newPassword: newPwd });
      setOldPwd(""); setNewPwd(""); setConfirmPwd(""); setShowPasswordFields(false);
      setPasswordSuccess("Password updated successfully");
    } catch (err) { setPasswordMsg(err.response?.data?.message || "Failed to update password"); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.pageTitle}>Account Settings</h2>
          <p style={styles.pageSubtitle}>Manage your public profile and security preferences</p>
        </header>

        {/* CUSTOM MODAL OVERLAY */}
        {showConfirm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>Remove Photo?</h3>
              <p style={styles.modalText}>This will delete your current profile picture. You can upload a new one anytime.</p>
              <div style={styles.modalActions}>
                <button style={styles.ghostBtn} onClick={() => setShowConfirm(false)}>Keep it</button>
                <button style={styles.dangerBtnLarge} onClick={confirmRemovePhoto}>Yes, Remove</button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE IMAGE SECTION */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Profile Picture</h3>
            <p style={styles.helper}>Update or remove your photo to change your appearance</p>
          </div>
          
          <div style={styles.imageFlex}>
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>
                {(imageEdit ? tempImage : savedImage) ? (
                  <img src={imageEdit ? tempImage : savedImage} alt="avatar" style={styles.img} />
                ) : (
                  <span>{profile.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div style={styles.cameraIcon} onClick={() => fileRef.current.click()}>📷</div>
            </div>

            <div style={styles.imageActions}>
              {!imageEdit ? (
                <div style={styles.actionRow}>
                  <button style={styles.primaryBtn} onClick={() => fileRef.current.click()}>
                    Change Photo
                  </button>
                  {savedImage && (
                    <button style={styles.dangerBtn} onClick={() => setShowConfirm(true)}>
                      Remove Photo
                    </button>
                  )}
                </div>
              ) : (
                <div style={styles.actionRow}>
                  <button style={styles.successBtn} onClick={saveImageChange}>
                    Save New Photo
                  </button>
                  <button style={styles.ghostBtn} onClick={() => { setTempImage(savedImage); setImageEdit(false); }}>
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleImageSelect} />
            </div>
          </div>
        </section>

        {/* PERSONAL INFO SECTION */}
        <section style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>Personal Information</h3></div>
          <div style={styles.row}>
            <div style={styles.rowLabel}>Full Name</div>
            <div style={styles.rowContent}>
              {!editName ? <div style={styles.dataPoint}>{profile.name}</div> : 
              <input style={styles.input} type="text" value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />}
            </div>
            <button style={styles.rowBtn} onClick={() => editName ? saveName() : setEditName(true)}>{editName ? "Save" : "Edit"}</button>
          </div>
          <div style={styles.row}>
            <div style={styles.rowLabel}>Email Address</div>
            <div style={styles.rowContent}>
              {!editEmail ? <div style={styles.dataPoint}>{profile.email}</div> : 
              <input style={styles.input} type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />}
            </div>
            <button style={styles.rowBtn} onClick={() => editEmail ? saveEmail() : setEditEmail(true)}>{editEmail ? "Save" : "Edit"}</button>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section style={styles.card}>
          <div style={styles.cardHeader}><h3 style={styles.cardTitle}>Security</h3></div>
          {!showPasswordFields ? (
            <div style={styles.securityRow}>
              <div>
                <div style={styles.dataPoint}>Password</div>
                <div style={styles.helper}>Update your account security</div>
              </div>
              <button style={styles.secondaryBtn} onClick={() => setShowPasswordFields(true)}>Update Password</button>
            </div>
          ) : (
            <div style={styles.passwordForm}>
              <input style={styles.input} type="password" placeholder="Current Password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
              <input style={styles.input} type="password" placeholder="New Password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              <input style={styles.input} type="password" placeholder="Confirm New Password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
              <div style={styles.actionRow}>
                <button style={styles.primaryBtn} onClick={updatePassword}>Update Password</button>
                <button style={styles.ghostBtn} onClick={() => { setShowPasswordFields(false); setOldPwd(""); setNewPwd(""); setConfirmPwd(""); }}>Cancel</button>
              </div>
            </div>
          )}
          {passwordMsg && <p style={styles.error}>{passwordMsg}</p>}
          {passwordSuccess && <p style={styles.success}>{passwordSuccess}</p>}
        </section>
      </div>
    </div>
  );
}

/* ================= UPDATED STYLES ================= */

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)", padding: "60px 20px", color: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "40px" },
  pageTitle: { fontSize: "32px", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 8px 0" },
  pageSubtitle: { color: "#94a3b8", fontSize: "16px" },
  
  // Modal Styles
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  modal: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", maxWidth: "400px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
  modalTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#fff" },
  modalText: { color: "#94a3b8", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" },
  modalActions: { display: "flex", gap: "12px", justifyContent: "center" },

  card: { background: "rgba(30, 41, 59, 0.4)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "32px", marginBottom: "24px" },
  cardHeader: { marginBottom: "24px" },
  cardTitle: { fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0" },
  helper: { fontSize: "14px", color: "#64748b" },
  imageFlex: { display: "flex", alignItems: "center", gap: "30px" },
  avatarWrapper: { position: "relative" },
  avatar: { width: "100px", height: "100px", borderRadius: "32px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "#fff", overflow: "hidden" },
  cameraIcon: { position: "absolute", bottom: "-5px", right: "-5px", background: "#1e293b", border: "2px solid #0f172a", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", cursor: "pointer" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  imageActions: { flex: 1 },
  actionRow: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  
  primaryBtn: { background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" },
  successBtn: { background: "#10b981", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" },
  dangerBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" },
  dangerBtnLarge: { background: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 24px", fontWeight: "600", cursor: "pointer" },
  secondaryBtn: { background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" },
  ghostBtn: { background: "transparent", color: "#94a3b8", border: "none", padding: "10px 20px", cursor: "pointer", fontWeight: "600" },
  
  row: { display: "flex", alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  rowLabel: { width: "150px", fontSize: "14px", color: "#94a3b8", fontWeight: "500" },
  rowContent: { flex: 1 },
  dataPoint: { fontSize: "16px", fontWeight: "500", color: "#f1f5f9" },
  rowBtn: { background: "transparent", border: "none", color: "#818cf8", fontWeight: "600", fontSize: "14px", cursor: "pointer", padding: "8px 16px" },
  input: { background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#fff", width: "100%", maxWidth: "300px", outline: "none" },
  securityRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  passwordForm: { display: "flex", flexDirection: "column", gap: "12px" },
  error: { color: "#f87171", marginTop: "12px", fontSize: "14px" },
  success: { color: "#4ade80", marginTop: "12px", fontSize: "14px" },
};

export default ProfileSettings;