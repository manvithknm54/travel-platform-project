import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";

/* =========================
   GET USER PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   UPDATE PROFILE (NAME / EMAIL / IMAGE)
========================= */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        profileImage,
      },
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // fetch user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    /* ---- verify old password ---- */
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    /* ---- prevent same password ---- */
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "Old password and new password cannot be the same",
      });
    }

    /* ---- update password ---- */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update password",
    });
  }
};
