import express from "express";
import get_featured from "../middlewares/featured.js";
import argon2 from "argon2";
const router = express.Router();


// idk which one actually works, just keep it here for now
router.use(express.urlencoded({ extended: true }))
router.use(express.json());

router.get("/", get_featured, (req, res) => {
    res.render("index", {
        /* Include gallery of randomly selected featured games */
        images: req.app.get("featured"),
        title: "Home",
    });
});

router.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Sign in",
    });
});

router.get("/register", (req, res) => {
    res.render("register", {
        title: "Register",
    });
});


router.post("/create", async (req, res) => {
  try {
    const { name, password, confirm } = req.body;

    let errors = [];

    if (!name || !password || !confirm) {
      errors.push("All fields are required.");
    }

    if (name.length < 8 || password.length < 8) {
      errors.push("Username and password must be at least 8 characters long.");
    }

    if (password !== confirm) {
      errors.push("Passwords do not match!");
    }
    let users = req.app.get("db").collection("users");
    
    const existingUser = await users.findOne({ name });
    if (existingUser) {
      errors.push("Username already taken. Choose another one!");
    }

    if (errors.length > 0) {
      return res.json({ success: false, message: errors[0] }); 
    }
  

    const hashedPassword = await argon2.hash(password);
    await users.insertOne({ name, password: hashedPassword });

    return res.json({ success: true, message: "Account created successfully!" });

  } catch (error) {
    console.error("Error:", error);
    return res.json({ success: false, message: "Something went wrong. Please try again." });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.json({ success: false, message: "All fields are required."});
    }

    if (name.length < 8 || password.length < 8) {
      return res.json({ success: false, message: "Username and password must be at least 8 characters long." });
    }
    let users = req.app.get("db").collection("users");
    const user = await users.findOne({ name });
    if (!user) {
        return res.json({ success: false, message: "Invalid username or password." });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        return res.json({ success: false, message: "Invalid username or password." });
    }
    return res.json({ success: true, message: "Login successful!" });

  } catch (error) {
    console.error("Error:", error);
    return res.json({ success: false, message: "Something went wrong. Please try again." });
  }
});

export default router;
