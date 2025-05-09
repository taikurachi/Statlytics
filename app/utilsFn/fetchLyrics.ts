import axios from "axios";

export const fetchLyrics = async (isrc: string) => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://your-production-url.com" // Use the production base URL
        : "http://localhost:3000"; // Use localhost URL during development

    const url = `${baseUrl}/api/lyrics?isrc=${isrc}`;
    const res = await axios.get(url);
    return res?.data?.message?.body?.lyrics?.lyrics_body || "";
  } catch (err) {
    console.error(err);
  }
};
