import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { CasualDB } from "./lib/CasualDB/mod.ts";
// import { CasualDB } from "https://deno.land/x/casualdb/mod.ts";

const app = new Application();
const port: number = 65000;

interface Schema {
  count: number;
}

const db = new CasualDB<Schema>(); // instantiate the db, casually 🤓
await db.connect("./.data/data.json"); // "connect" to the db (JSON file)

// (optional) seed it with data, if starting with an empty db
// await db.seed({
//   count: 0,
// });



// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

const router = new Router();
router.get("/", async ({ response }: { response: any }) => {
  const count = await db.get<Schema["count"]>("count");
  await db.write("count", count.value() + 1);

  response.body = {
    count: count.value(),
  };
});
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`);
});

await app.listen({ port });
