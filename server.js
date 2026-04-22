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
    res.send("🚀 Ultra Premium Mental Health Report API");
});

/**************************************************************
 * GENERATE REPORT
 **************************************************************/
app.post("/generate-certificate", async (req, res) => {
    try {
        const data = req.body;

        const width = 595;
        const height = 842;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        /**************************************************************
         * BACKGROUND
         **************************************************************/
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#eef2ff");
        gradient.addColorStop(1, "#f8fafc");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        /**************************************************************
         * MAIN CARD
         **************************************************************/
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(30, 30, width - 60, height - 60);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        ctx.textAlign = "center";

        /**************************************************************
         * HEADER BAR
         **************************************************************/
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(30, 30, width - 60, 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("STUDENT MENTAL HEALTH REPORT", width / 2, 60);

        /**************************************************************
         * REPORT INFO
         **************************************************************/
        ctx.fillStyle = "#6b7280";
        ctx.font = "12px sans-serif";
        ctx.fillText(`Report ID: MH-${Date.now()}`, width / 2, 95);

        /**************************************************************
         * NAME
         **************************************************************/
        ctx.fillStyle = "#000";
        ctx.font = "14px sans-serif";
        ctx.fillText("Student Name", width / 2, 130);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(data.name || "Student", width / 2, 160);

        /**************************************************************
         * SECTION TITLE
         **************************************************************/
        ctx.fillStyle = "#374151";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Assessment Overview", width / 2, 210);

        /**************************************************************
         * PROGRESS BAR FUNCTION
         **************************************************************/
        function drawBar(label, value, y, color) {
            const barWidth = 300;
            const x = width / 2 - barWidth / 2;

            ctx.fillStyle = "#000";
            ctx.font = "13px sans-serif";
            ctx.fillText(label, width / 2, y - 12);

            // Background
            ctx.fillStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, 10, 5);
            ctx.fill();

            // Fill
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, (value / 100) * barWidth, 10, 5);
            ctx.fill();

            // Value
            ctx.fillStyle = "#6b7280";
            ctx.fillText(`${value}%`, width / 2, y + 25);
        }

        /**************************************************************
         * DRAW BARS
         **************************************************************/
        drawBar("Mental Health", data.mental, 240, "#4f46e5");
        drawBar("Stress Level", data.stress, 300, "#f59e0b");
        drawBar("Physical Health", data.physical, 360, "#10b981");

        /**************************************************************
         * STATUS BOX
         **************************************************************/
        let color = "#16a34a";
        if (data.level === "Moderate") color = "#f59e0b";
        if (data.level === "Severe") color = "#ef4444";

        ctx.fillStyle = "#f9fafb";
        ctx.fillRect(100, 420, width - 200, 60);

        ctx.fillStyle = color;
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(`Overall Status: ${data.level}`, width / 2, 455);

        /**************************************************************
         * SUGGESTIONS
         **************************************************************/
        ctx.fillStyle = "#374151";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Recommendations", width / 2, 520);

        ctx.font = "13px sans-serif";

        const lines = (data.suggestions || "").split("\n");

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, 560 + i * 22);
        });

        /**************************************************************
         * FOOTER
         **************************************************************/
        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px sans-serif";
        ctx.fillText(
            "This report is generated for awareness purposes only",
            width / 2,
            790
        );

        /**************************************************************
         * EXPORT
         **************************************************************/
        const buffer = canvas.toBuffer("image/png");
        const base64Image = buffer.toString("base64");

        res.json({ image: base64Image });

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

/**************************************************************
 * START SERVER
 **************************************************************/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});