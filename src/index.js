// src/index.js

import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// Utility to serve static files from a given directory
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
  } catch (err) {
    return new Response("Not Found", { status: 404 });
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve public assets
    if (url.pathname.startsWith("/")) {
      const res = await serveStatic(env.ASSETS, request, "/");
      if (res) return res;
    }

    // Serve Scramjet assets
    if (url.pathname.startsWith("/scram/")) {
      const res = await serveStatic(scramjetPath, request, "/scram/");
      if (res) return res;
    }

    // Serve Epoxy assets
    if (url.pathname.startsWith("/epoxy/")) {
      const res = await serveStatic(epoxyPath, request, "/epoxy/");
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
