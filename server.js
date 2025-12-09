import path from "path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = Fastify({ logger: true });

app.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/",
});

// Fallback to index.html for SPA routes
app.setNotFoundHandler((request, reply) => {
  reply.sendFile("index.html");
});

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
