import express from "express";
import { getUsers, createUser, updateUser, deleteUser, getUserById, login, register, logout, getProfile,changePassword, updateProfile} from "../controllers/userController.js";
import { verifyToken } from "../middelware/authMiddelware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login",login);
router.get ("/profile", verifyToken,getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/profile/password", verifyToken,changePassword)
router.post("/logout", verifyToken, logout);
router.get("/", verifyToken,getUsers);
router.post("/", verifyToken,createUser);
router.get("/:id", verifyToken,getUserById);
router.put("/:id",verifyToken, updateUser);
router.delete("/:id", verifyToken,deleteUser);

router.get('/token/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ error: "Refresh token not valid" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
