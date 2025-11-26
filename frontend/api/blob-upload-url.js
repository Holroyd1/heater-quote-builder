import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Get ?filename=... from the URL
    const url = new URL(req.url, "http://localhost");
    const filename =
      url.searchParams.get("filename") || `upload-${Date.now()}`;

    // req is a readable stream (the file body)
    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true,
    });

    // Return just the public URL to the browser
    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}
