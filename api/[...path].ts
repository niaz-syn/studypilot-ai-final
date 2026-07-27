import app from "../server";

// Vercel serves concrete API function files before rewrites. This catch-all
// ensures nested API URLs such as POST /api/ai/chat reach the Express router
// instead of Vercel's static/function resolver returning 405 Method Not Allowed.
export default app;
