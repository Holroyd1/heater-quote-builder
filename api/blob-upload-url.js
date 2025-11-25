import { createUploadUrl } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { url } = await createUploadUrl({
      access: "public",
    });

    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
