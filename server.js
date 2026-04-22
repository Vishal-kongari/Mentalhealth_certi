const express = require("express");
const cors = require("cors");

// ✅ Ensure fetch works (Node 18+ safe)
const fetch = global.fetch;

const app = express();
app.use(express.json());
app.use(cors());

/**************************************************************
 * ✅ HEALTH CHECK
 **************************************************************/
app.get("/", (req, res) => {
    res.send("🚀 Mental Certificate API is running");
});

/**************************************************************
 * 🎯 GENERATE CERTIFICATE
 **************************************************************/
app.post("/generate-certificate", async (req, res) => {
    try {
        const data = req.body;
        console.log("📥 Received Data:", data);

        /**************************************************************
         * 🎨 CERTIFICATE HTML
         **************************************************************/
        const html = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial;
          width: 900px;
          padding: 40px;
          background: linear-gradient(135deg, #eef2ff, #f0fdf4);
        }

        .container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
        }

        .name {
          text-align: center;
          margin: 20px 0;
          font-size: 18px;
        }

        .grid {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .card {
          flex: 1;
          padding: 20px;
          background: #f3f4f6;
          border-radius: 12px;
          text-align: center;
        }

        .level {
          margin-top: 20px;
          text-align: center;
          font-size: 22px;
          font-weight: bold;
          color: ${data.level === "Healthy"
                ? "green"
                : data.level === "Mild"
                    ? "orange"
                    : "red"
            };
        }

        .suggestions {
          margin-top: 20px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="title">Certificate of Mental Wellness</div>

        <div class="name">
          This certifies that <b>${data.name}</b>
        </div>

        <div class="grid">
          <div class="card">Mental<br><b>${data.mental}%</b></div>
          <div class="card">Stress<br><b>${data.stress}%</b></div>
          <div class="card">Physical<br><b>${data.physical}%</b></div>
        </div>

        <div class="level">${data.level}</div>

        <div class="suggestions">
          <b>Suggestions:</b>
          <p>${data.suggestions.replace(/\\n/g, "<br>")}</p>
        </div>
      </div>
    </body>
    </html>
    `;

        /**************************************************************
         * 🔥 CALL HTML → IMAGE API
         **************************************************************/
        const apiResponse = await fetch("https://htmlcsstoimage.com/demo_run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ html })
        });

        const result = await apiResponse.json();
        console.log("🧪 Image API Result:", result);

        if (!result.url) {
            throw new Error("Image API failed or rate limited");
        }

        /**************************************************************
         * 🔁 CONVERT IMAGE TO BASE64
         **************************************************************/
        const imageRes = await fetch(result.url);
        const buffer = await imageRes.arrayBuffer();

        const base64Image = Buffer.from(buffer).toString("base64");

        /**************************************************************
         * 📤 SEND RESPONSE
         **************************************************************/
        res.json({ image: base64Image });

    } catch (err) {
        console.error("❌ ERROR:", err);

        res.status(500).json({
            error: "Failed to generate certificate",
            details: err.message
        });
    }
});

/**************************************************************
 * 🚀 START SERVER
 **************************************************************/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});