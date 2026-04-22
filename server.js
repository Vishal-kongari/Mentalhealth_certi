const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-certificate", (req, res) => {
    try {
        const data = req.body;

        const width = 595;
        const height = 842;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        /******** BACKGROUND GRADIENT ********/
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#eef2ff");
        gradient.addColorStop(1, "#f0fdf4");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        /******** CARD ********/
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(30, 30, width - 60, height - 60);

        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 3;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        ctx.textAlign = "center";

        /******** TITLE ********/
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText("Mental Wellness Certificate", width / 2, 100);

        ctx.font = "16px sans-serif";
        ctx.fillText("This certificate is awarded to", width / 2, 140);

        /******** NAME ********/
        ctx.font = "bold 22px sans-serif";
        ctx.fillStyle = "#4f46e5";
        ctx.fillText(data.name, width / 2, 180);

        /******** SCORES ********/
        ctx.fillStyle = "#111827";
        ctx.font = "16px sans-serif";

        ctx.fillText(`Mental Score: ${data.mental}%`, width / 2, 260);
        ctx.fillText(`Stress Score: ${data.stress}%`, width / 2, 290);
        ctx.fillText(`Physical Score: ${data.physical}%`, width / 2, 320);

        /******** CONDITION ********/
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle =
            data.level === "Healthy" ? "#16a34a" :
                data.level === "Mild" ? "#f59e0b" : "#ef4444";

        ctx.fillText(`Condition: ${data.level}`, width / 2, 380);

        /******** SUGGESTIONS ********/
        ctx.fillStyle = "#374151";
        ctx.font = "14px sans-serif";

        const lines = data.suggestions.split("\n");

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, 450 + i * 25);
        });

        /******** FOOTER ********/
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText("AI Generated Mental Wellness Report", width / 2, 780);

        const buffer = canvas.toBuffer("image/png");
        const base64Image = buffer.toString("base64");

        res.json({ image: base64Image });

    } catch (err) {
        res.status(500).json({ error: "Failed to generate certificate" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));