const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());
app.use(cors());

/**************************************************************
 * HEALTH CHECK
 **************************************************************/
app.get("/", (req, res) => {
    res.send("🚀 Mental Certificate API running (A4 Fixed)");
});

/**************************************************************
 * GENERATE CERTIFICATE (A4 PERFECT)
 **************************************************************/
app.post("/generate-certificate", async (req, res) => {
    try {
        const data = req.body;

        console.log("📥 Received:", data);

        /**************************************************************
         * 🎨 A4 SIZE
         **************************************************************/
        const width = 595;
        const height = 842;

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
         * 📦 CARD
         **************************************************************/
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(40, 40, width - 80, height - 80);

        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        ctx.textAlign = "center";

        /**************************************************************
         * 🏷 TITLE
         **************************************************************/
        ctx.fillStyle = "#111827";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Certificate of Mental Wellness", width / 2, 110);

        ctx.font = "14px sans-serif";
        ctx.fillText("This certifies that", width / 2, 150);

        /**************************************************************
         * 👤 NAME
         **************************************************************/
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#4f46e5";
        ctx.fillText(data.name || "User", width / 2, 190);

        /**************************************************************
         * 📊 SCORES
         **************************************************************/
        ctx.fillStyle = "#000";
        ctx.font = "15px sans-serif";

        ctx.fillText(`Mental Score: ${data.mental}%`, width / 2, 270);
        ctx.fillText(`Stress Score: ${data.stress}%`, width / 2, 300);
        ctx.fillText(`Physical Score: ${data.physical}%`, width / 2, 330);

        /**************************************************************
         * 🎯 CONDITION
         **************************************************************/
        let color = "#16a34a";
        if (data.level === "Moderate") color = "#f59e0b";
        if (data.level === "Severe") color = "#ef4444";

        ctx.fillStyle = color;
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(`Condition: ${data.level}`, width / 2, 390);

        /**************************************************************
         * 💡 SUGGESTIONS
         **************************************************************/
        ctx.fillStyle = "#374151";
        ctx.font = "14px sans-serif";

        const lines = (data.suggestions || "").split("\n");

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, 460 + i * 26);
        });

        /**************************************************************
         * FOOTER
         **************************************************************/
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText("AI Generated Mental Wellness Report", width / 2, 780);

        /**************************************************************
         * EXPORT
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
 * START SERVER
 **************************************************************/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});