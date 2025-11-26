import { put } from "@vercel/blob";

export default async function handler(req, res) {
  console.log("ENV TOKEN:", process.env.BLOB_READ_WRITE_TOKEN);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = new URL(req.url, "http://localhost");
    const filename = url.searchParams.get("filename") || `upload-${Date.now()}`;

    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
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
      envTokenPresent: !!process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}
