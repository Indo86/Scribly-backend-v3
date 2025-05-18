import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: "Success", message: "Users Retrieved", data: users });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "Error", message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) throw Object.assign(new Error("User tidak ditemukan 😮"), { statusCode: 400 });
    res.status(200).json({ status: "Success", message: "User Retrieved", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "Error", message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;
    if (!name || !email || !gender || !password)
      throw Object.assign(new Error(`${!name ? "Name" : !email ? "Email" : !gender ? "Gender" : "Password"} field cannot be empty 😠`), { statusCode: 401 });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json({ status: "Success", message: "User Created" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "Error", message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) throw Object.assign(new Error("User tidak ditemukan 😮"), { statusCode: 400 });
    if (!name || !email || !gender || !password)
      throw Object.assign(new Error(`${!name ? "Name" : !email ? "Email" : "Gender"} field cannot be empty 😠`), { statusCode: 401 });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ name, email, gender, password: hashedPassword }, { where: { id: req.params.id } });
    res.status(200).json({ status: "Success", message: "User Updated" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "Error", message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) throw Object.assign(new Error("User tidak ditemukan 😮"), { statusCode: 400 });
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ status: "Success", message: "User Deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "Error", message: error.message });
  }
}

// Register
async function register(req, res) {
  try {
    const { name, email, gender, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, gender, password: hashed });
    res.status(201).json({ status: "Success", message: "User registered", data: user });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const userPayload = { id: user.id, email: user.email };

  
    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });

    // Generate refresh token (umur panjang)
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Simpan refresh token ke DB
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    // Simpan refresh token ke cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true di production (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Kirim access token ke client
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      accessToken,
    });

  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}
async function logout(req, res) {
  try {
    const userId = req.userId;
    await User.update({ refresh_token: null }, { where: { id: userId } });
    res.status(200).json({ message: "Logout berhasil dan token dibersihkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  // GET PROFILE
 async function getProfile(req, res) {
  try {
    // req.userId diisi oleh verifyToken
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'gender'] // batasi field yang dikirim
    });
    if (!user) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }
    res.status(200).json({ status: "Success", data: user });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password is incorrect" });

    // hash & update
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id: req.userId } });

    res.json({ status: "Success", message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, email, gender } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    await user.update({ name, email, gender });

    res.status(200).json({
      status: "Success",
      message: "Profile updated",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
}




export { getUsers, getUserById, createUser, updateUser, deleteUser, login, register, logout, getProfile, changePassword, updateProfile};
