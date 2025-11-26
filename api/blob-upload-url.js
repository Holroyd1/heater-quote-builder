import { put } from "@vercel/blob";

// 🔴 TEMP: hard-coded token for debugging
// Replace XXXXX... with your full token string (the one starting BMYe... or similar)
const BLOB_TOKEN = "6N5dbArkb8snLkMC2q3iEe8g";

export default async function handler(req, res) {
  console.log("USING TOKEN (length):", BLOB_TOKEN ? BLOB_TOKEN.length : 0);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = new URL(req.url, "http://localhost");
    const filename =
      url.searchParams.get("filename") || `upload-${Date.now()}`;

    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true,
      // ⬇️ use the hard-coded token instead of env var
      token: BLOB_TOKEN,
    });

    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (err) {
    console.error("Blob upload error (DETAILED):", err);
    return res.status(500).json({
      error: "Upload failed on server",
      details: err.message,
    });
  }
}
