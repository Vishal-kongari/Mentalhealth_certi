const express = require("express");
const cors = require("cors");
const { createCanvas } = require("canvas");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("🚀 Premium Mental Health Report API");
});

app.post("/generate-certificate", async (req, res) => {
    try {
        const data = req.body;

        const width = 595;
        const height = 842;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        /******** BACKGROUND ********/
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#eef2ff");
        gradient.addColorStop(1, "#f0fdf4");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        /******** CARD ********/
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(40, 40, width - 80, height - 80);

        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        ctx.textAlign = "center";

        /******** TITLE ********/
        ctx.fillStyle = "#111827";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText("Student Mental Health Report", width / 2, 100);

        /******** NAME ********/
        ctx.font = "16px sans-serif";
        ctx.fillText("Prepared For", width / 2, 140);

        ctx.font = "bold 22px sans-serif";
        ctx.fillStyle = "#4f46e5";
        ctx.fillText(data.name || "Student", width / 2, 175);

        /******** SECTION TITLE ********/
        ctx.fillStyle = "#000";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("Assessment Scores", width / 2, 240);

        /******** FUNCTION: PROGRESS BAR ********/
        function drawBar(label, value, y, color) {
            const barWidth = 300;
            const x = width / 2 - barWidth / 2;

            // Label
            ctx.fillStyle = "#000";
            ctx.font = "14px sans-serif";
            ctx.fillText(`${label}: ${value}%`, width / 2, y - 10);

            // Background bar
            ctx.fillStyle = "#e5e7eb";
            ctx.fillRect(x, y, barWidth, 10);

            // Fill bar
            ctx.fillStyle = color;
            ctx.fillRect(x, y, (value / 100) * barWidth, 10);
        }

        /******** DRAW PROGRESS BARS ********/
        drawBar("Mental Health", data.mental, 280, "#4f46e5");
        drawBar("Stress Level", data.stress, 330, "#f59e0b");
        drawBar("Physical Wellbeing", data.physical, 380, "#10b981");

        /******** CONDITION ********/
        let color = "#16a34a";
        if (data.level === "Moderate") color = "#f59e0b";
        if (data.level === "Severe") color = "#ef4444";

        ctx.fillStyle = color;
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`Overall Status: ${data.level}`, width / 2, 440);

        /******** ICONS (SIMPLE SHAPES) ********/
        ctx.fillStyle = "#4f46e5";
        ctx.beginPath(); // brain icon (circle)
        ctx.arc(150, 500, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath(); // stress icon
        ctx.arc(300, 500, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#10b981";
        ctx.beginPath(); // heart icon
        ctx.arc(450, 500, 10, 0, Math.PI * 2);
        ctx.fill();

        /******** SUGGESTIONS ********/
        ctx.fillStyle = "#000";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("Recommended Actions", width / 2, 540);

        ctx.font = "14px sans-serif";

        const lines = (data.suggestions || "").split("\n");

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, 580 + i * 26);
        });

        /******** FOOTER ********/
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(
            "This report is generated for awareness purposes only",
            width / 2,
            780
        );

        /******** EXPORT ********/
        const buffer = canvas.toBuffer("image/png");
        const base64Image = buffer.toString("base64");

        res.json({ image: base64Image });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running"));