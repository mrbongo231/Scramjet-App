// src/index.js

// Helper to serve static assets from the bound ASSETS directory
async function serveStatic(directory, request, prefix = "") {
  if (!directory) return null;
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

async function handleFetch(request, env, ctx) {
  // Serve public assets when the `ASSETS` binding is available (Cloudflare Worker)
  const publicRes = await serveStatic(env && env.ASSETS, request, "/");
  if (publicRes) return publicRes;

  // Default 404
  return new Response("404 Not Found", { status: 404 });
}

// Export both a default object (Worker modules expect this) and a named
// `fetch` export to maximize compatibility with different deploy flows.
export default { fetch: handleFetch };
export { handleFetch as fetch };
