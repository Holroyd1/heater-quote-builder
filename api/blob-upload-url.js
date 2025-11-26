import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    // If someone does GET in the browser, they see this:
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read ?filename= from the URL
    const url = new URL(req.url, "http://localhost");
    const filename =
      url.searchParams.get("filename") || `upload-${Date.now()}`;

    // Upload the incoming request body (the file) to Vercel Blob
    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true,
     token: process.env.BLOB_READ_WRITE_TOKEN
});

    // Send the blob info back to the browser as JSON
    return res.status(200).json({
      url: blob.url,              // public URL
      downloadUrl: blob.downloadUrl, // download URL (optional)
    });
  } catch (err) {
    console.error("Blob upload error:", err);
    return res
      .status(500)
      .json({ error: "Upload failed on server", details: err.message });
  }
}
