const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./User");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fixed CORS config
app.use(cors({
  origin: ["https://keen-bombolone-9c7fda.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/add-user", async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, phone, address });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
