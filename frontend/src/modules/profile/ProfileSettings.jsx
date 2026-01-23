import { useEffect, useRef, useState } from "react";
import apiClient from "../../services/apiClient";

function ProfileSettings() {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState({});
  const [savedImage, setSavedImage] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [imageEdit, setImageEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    setShowConfirm(false);
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
    window.dispatchEvent(new Event("profile-updated"));
  };

  const updatePassword = async () => {
    setPasswordMsg(""); setPasswordSuccess("");
    if (newPwd !== confirmPwd) { setPasswordMsg("Passwords do not match"); return; }
    try {
      await apiClient.put("/users/change-password", { oldPassword: oldPwd, newPassword: newPwd });
      setOldPwd(""); setNewPwd(""); setConfirmPwd(""); setShowPasswordFields(false);
      setPasswordSuccess("Security updated successfully");
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.pageTitle}>Explorer Settings</h2>
          <p style={styles.pageSubtitle}>Manage your safari profile and digital security</p>
        </header>

        {/* MODAL */}
        {showConfirm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>Remove Photo?</h3>
              <p style={styles.modalText}>Your avatar will revert to initials.</p>
              <div style={styles.modalActions}>
                <button style={styles.ghostBtn} onClick={() => setShowConfirm(false)}>Cancel</button>
                <button style={styles.dangerBtnLarge} onClick={confirmRemovePhoto}>Remove Photo</button>
              </div>
            </div>
          </div>
        )}

        {/* AVATAR SECTION */}
        <section style={styles.card}>
          <div style={styles.imageFlex}>
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>
                {(imageEdit ? tempImage : savedImage) ? (
                  <img src={imageEdit ? tempImage : savedImage} alt="avatar" style={styles.img} />
                ) : (
                  <span>{profile.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div style={styles.cameraIcon} onClick={() => fileRef.current.click()}>📸</div>
            </div>
            <div>
              <h3 style={styles.cardTitle}>Profile Avatar</h3>
              <p style={styles.helper}>Visible to your fellow travelers</p>
              <div style={styles.actionRow}>
                {!imageEdit ? (
                  <>
                    <button style={styles.primaryBtn} onClick={() => fileRef.current.click()}>Upload</button>
                    {savedImage && <button style={styles.dangerBtn} onClick={() => setShowConfirm(true)}>Remove</button>}
                  </>
                ) : (
                  <>
                    <button style={styles.primaryBtn} onClick={saveImageChange}>Save</button>
                    <button style={styles.ghostBtn} onClick={() => { setTempImage(savedImage); setImageEdit(false); }}>Discard</button>
                  </>
                )}
              </div>
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleImageSelect} />
            </div>
          </div>
        </section>

        {/* IDENTITY SECTION */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Identity</h3>
          <div style={styles.row}>
            <div style={styles.rowLabel}>Full Name</div>
            <div style={styles.rowContent}>
              {!editName ? (
                <div style={styles.dataPoint}>{profile.name}</div>
              ) : (
                <input style={styles.input} value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              )}
            </div>
            <button style={styles.rowBtn} onClick={() => editName ? saveName() : setEditName(true)}>
              {editName ? "Save" : "Edit"}
            </button>
          </div>

          <div style={styles.row}>
            <div style={styles.rowLabel}>Email</div>
            <div style={styles.rowContent}>
              {!editEmail ? (
                <div style={styles.dataPoint}>{profile.email}</div>
              ) : (
                <input style={styles.input} value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              )}
            </div>
            <button style={styles.rowBtn} onClick={() => editEmail ? saveEmail() : setEditEmail(true)}>
              {editEmail ? "Save" : "Edit"}
            </button>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Security</h3>
          {!showPasswordFields ? (
            <div style={styles.securityRow}>
              <div>
                <div style={styles.dataPoint}>Password</div>
                <div style={styles.helper}>Protected access</div>
              </div>
              <button style={styles.rowBtn} onClick={() => setShowPasswordFields(true)}>Change</button>
            </div>
          ) : (
            <div style={styles.passwordForm}>
              <input style={styles.inputFull} type="password" placeholder="Current password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
              <div style={styles.actionRow}>
                <input style={styles.inputHalf} type="password" placeholder="New password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                <input style={styles.inputHalf} type="password" placeholder="Confirm" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
              </div>
              <div style={styles.actionRow}>
                <button style={styles.primaryBtn} onClick={updatePassword}>Save</button>
                <button style={styles.ghostBtn} onClick={() => setShowPasswordFields(false)}>Cancel</button>
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

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", padding: "80px 20px", color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "720px", margin: "0 auto" },
  header: { marginBottom: "48px" },
  pageTitle: { fontSize: "32px", fontWeight: "800", marginBottom: "8px" },
  pageSubtitle: { color: "var(--text-secondary)", fontSize: "16px" },
  card: { background: "var(--surface)", borderRadius: "24px", border: "1px solid var(--border)", padding: "32px", marginBottom: "24px" },
  cardTitle: { fontSize: "18px", fontWeight: "700", marginBottom: "6px" },
  helper: { fontSize: "14px", color: "var(--text-secondary)" },
  imageFlex: { display: "flex", gap: "32px", alignItems: "center" },
  avatarWrapper: { position: "relative" },
  avatar: { width: "120px", height: "120px", borderRadius: "36px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", fontWeight: "800", color: "var(--primary)", overflow: "hidden" },
  cameraIcon: { position: "absolute", bottom: "6px", right: "6px", width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  actionRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
  primaryBtn: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 24px", fontWeight: "700", cursor: "pointer" },
  dangerBtn: { background: "transparent", border: "1px solid #EF4444", color: "#EF4444", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer" },
  dangerBtnLarge: { background: "#EF4444", color: "#fff", border: "none", borderRadius: "14px", padding: "14px", fontWeight: "700", cursor: "pointer" },
  ghostBtn: { background: "transparent", border: "none", color: "var(--text-secondary)", fontWeight: "600", cursor: "pointer" },
  row: { display: "flex", alignItems: "center", padding: "20px 0", borderBottom: "1px solid var(--border)" },
  rowLabel: { width: "160px", fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase" },
  rowContent: { flex: 1 },
  dataPoint: { fontSize: "16px", fontWeight: "500" },
  rowBtn: { background: "transparent", border: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer", fontSize: "14px" },
  input: {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: "12px",
  padding: "12px 16px",
  width: "100%",
  maxWidth: "320px",
  outline: "none",
},
  inputFull: { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "12px", padding: "14px 16px", width: "100%", outline: "none" },
  inputHalf: { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "12px", padding: "14px 16px", flex: 1, outline: "none" },
  securityRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  passwordForm: { display: "flex", flexDirection: "column", gap: "16px" },
  error: { color: "#EF4444", marginTop: "16px", fontWeight: "600" },
  success: { color: "var(--primary)", marginTop: "16px", fontWeight: "600" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  modal: { background: "var(--surface)", borderRadius: "28px", border: "1px solid var(--border)", padding: "40px", maxWidth: "420px", textAlign: "center" },
  modalTitle: { fontSize: "22px", fontWeight: "800", marginBottom: "12px" },
  modalText: { color: "var(--text-secondary)", marginBottom: "32px" },
  modalActions: { display: "flex", flexDirection: "column", gap: "12px" },
};

export default ProfileSettings;