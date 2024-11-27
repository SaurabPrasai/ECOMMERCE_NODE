const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { preventAuth } = require("../middleware/requireAuth");

router.get("/signup", preventAuth, (req, res) => {
  res.render("auth/signup", { title: "Signup Page" });
});

router.get("/login", preventAuth, (req, res) => {
  res.render("auth/login", { title: "login Page" });
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    req.session.userId = user._id;
    req.session.cart=[]
    return res.status(302).redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.userId = "";
  res.redirect("/login");
});

module.exports = router;
