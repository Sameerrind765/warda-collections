import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Email endpoint
app.post("/send", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const emailResponse = await resend.emails.send({
      from: "Warda Collections <info@wardacollections.com>",
      to,
      subject,
      html: `<p>${message}</p>`
    });

    res.status(200).json({ success: true, id: emailResponse.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});