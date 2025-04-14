require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
    name: String,
    address: String,
    age: Number,
});

const Student = mongoose.model("Student", studentSchema, "Students");

// Search students by name (case-insensitive, partial match)
app.get("/students/by-name", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: "Name parameter is required" });

        const regex = new RegExp(name, "i"); // Case-insensitive regex
        const students = await Student.find({ name: regex });

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Search students by address (case-insensitive, partial match)
app.get("/students/by-address", async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) return res.status(400).json({ error: "Address parameter is required" });

        const regex = new RegExp(address, "i"); // Case-insensitive regex
        const students = await Student.find({ address: regex });

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

