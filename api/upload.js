import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);

      const fileName = "attachment-" + Date.now();

      const blob = await put(fileName, buffer, {
        access: "public",
      });

      res.status(200).json({ url: blob.url });
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
}
