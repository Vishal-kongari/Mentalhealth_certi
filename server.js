const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());
app.use(cors());

/**************************************************************
 * ✅ HEALTH CHECK
 **************************************************************/
app.get("/", (req, res) => {
    res.send("🚀 Mental Certificate API is running (Canvas Mode)");
});

/**************************************************************
 * 🎯 GENERATE CERTIFICATE USING CANVAS
 **************************************************************/
app.post("/generate-certificate", async (req, res) => {
    try {
        const data = req.body;

        console.log("📥 Received:", data);

        /**************************************************************
         * 🎨 CREATE CANVAS
         **************************************************************/
        const width = 1000;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        /**************************************************************
         * 🌈 BACKGROUND
         **************************************************************/
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#eef2ff");
        gradient.addColorStop(1, "#f0fdf4");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        /**************************************************************
         * 📦 WHITE CARD
         **************************************************************/
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(50, 50, 900, 500);

        /**************************************************************
         * 🏷 TITLE
         **************************************************************/
        ctx.fillStyle = "#000";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Mental Wellness", width / 2, 120);

        /**************************************************************
         * 👤 NAME
         **************************************************************/
        ctx.font = "20px Arial";
        ctx.fillText(`This certifies ${data.name}`, width / 2, 170);

        /**************************************************************
         * 📊 SCORES
         **************************************************************/
        ctx.font = "18px Arial";

        ctx.fillText(`Mental: ${data.mental}%`, 250, 250);
        ctx.fillText(`Stress: ${data.stress}%`, 450, 250);
        ctx.fillText(`Physical: ${data.physical}%`, 650, 250);

        /**************************************************************
         * 🎯 LEVEL
         **************************************************************/
        let color = "green";
        if (data.level === "Moderate") color = "orange";
        if (data.level === "Severe") color = "red";

        ctx.fillStyle = color;
        ctx.font = "bold 26px Arial";
        ctx.fillText(data.level, width / 2, 320);

        /**************************************************************
         * 💡 SUGGESTIONS
         **************************************************************/
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";

        const suggestions = data.suggestions.split("\n");

        suggestions.forEach((line, i) => {
            ctx.fillText(line, width / 2, 380 + i * 25);
        });

        /**************************************************************
         * 🖼 EXPORT IMAGE
         **************************************************************/
        const buffer = canvas.toBuffer("image/png");
        const base64Image = buffer.toString("base64");

        res.json({ image: base64Image });

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({ error: "Failed to generate certificate" });
    }
});

/**************************************************************
 * 🚀 START SERVER
 **************************************************************/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});