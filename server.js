const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("🚀 Mental Certificate API running (A4 Canvas)");
});

app.post("/generate-certificate", (req, res) => {
    try {
        const data = req.body;

        const width = 595;   // A4 width
        const height = 842;  // A4 height

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = "#4f46e5";
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        ctx.textAlign = "center";

        // Title
        ctx.fillStyle = "#000";
        ctx.font = "bold 26px Arial";
        ctx.fillText("Certificate of Mental Wellness", width / 2, 100);

        // Subtitle
        ctx.font = "16px Arial";
        ctx.fillText("This certifies", width / 2, 150);

        // Name
        ctx.font = "bold 22px Arial";
        ctx.fillText(data.name, width / 2, 190);

        // Scores
        ctx.font = "16px Arial";
        ctx.fillText(`Mental Score: ${data.mental}%`, width / 2, 260);
        ctx.fillText(`Stress Score: ${data.stress}%`, width / 2, 290);
        ctx.fillText(`Physical Score: ${data.physical}%`, width / 2, 320);

        // Level
        ctx.font = "bold 22px Arial";
        ctx.fillStyle =
            data.level === "Healthy" ? "green" :
                data.level === "Mild" ? "orange" : "red";

        ctx.fillText(`Condition: ${data.level}`, width / 2, 380);

        // Suggestions
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";

        const lines = data.suggestions.split("\n");
        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, 450 + i * 25);
        });

        // Footer
        ctx.font = "12px Arial";
        ctx.fillText("AI Generated Mental Wellness Report", width / 2, 780);

        const buffer = canvas.toBuffer("image/png");
        const base64Image = buffer.toString("base64");

        res.json({ image: base64Image });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate certificate" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running"));