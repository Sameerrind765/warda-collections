import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Resend } from "resend";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post("/contact", async (req, res) => {
  const { email, name, subject, message } = req.body;

  try {
    const emailResponse = await resend.emails.send({
      from: "Warda Collections <info@wardacollections.com>",
      to: "sameerrind789@gmail.com",
      subject: subject,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
  <h1 style="color: #d3e97a; font-size: 24px; border-bottom: 2px solid #d3e97a; padding-bottom: 10px; margin-bottom: 20px;">New Contact Form Submission</h1>
  <p style="font-size: 16px; margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
  <p style="font-size: 16px; margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #d3e97a; text-decoration: none;">${email}</a></p>
  <div style="background-color: #1a1a1a; padding: 15px; border-radius: 6px; margin-top: 20px;">
    <h2 style="color: #d3e97a; font-size: 18px; margin-top: 0;">Message:</h2>
    <p style="font-size: 16px; line-height: 1.6;">${message}</p>
  </div>
</div>
`,

    });
    res.status(200).json({ success: true, id: emailResponse.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { publicIds } = req.body; // now expecting array

  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return res.status(400).json({ error: "Missing required parameter - publicIds" });
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_ids: publicIds }), // Cloudinary expects `public_ids`
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
