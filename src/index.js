import { scramjetPath } from "@mercuryworkshop/scramjet/path";
// epoxyPath import removed (not exported in v2.1.28)
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// Helper to serve static assets
async function serveStatic(directory, request, prefix = "") {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(prefix)) return null;

  const relativePath = url.pathname.replace(prefix, "");
  try {
    const file = await directory.get(relativePath);
    if (file) {
      return new Response(file.body, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
    }
  } catch {
    return new Response("Not Found", { status: 404 });
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve public assets
    const publicRes = await serveStatic(env.ASSETS, request, "/");
    if (publicRes) return publicRes;

    // Serve Scramjet assets
    if (url.pathname.startsWith("/scram/")) {
      const res = await serveStatic(scramjetPath, request, "/scram/");
      if (res) return res;
    }

    // Serve BareMux assets
    if (url.pathname.startsWith("/baremux/")) {
      const res = await serveStatic(baremuxPath, request, "/baremux/");
      if (res) return res;
    }

    // Default 404
    return new Response("404 Not Found", { status: 404 });
  },
};
