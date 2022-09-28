import cors from "@koa/cors";
import Router from "@koa/router";
import { koaMiddleware as publicodesAPI } from "@publicodes/api";
import Koa from "koa";
import Engine from "publicodes";
import { parse } from "yaml";

const app = new Koa();
const router = new Router();

app.use(cors());

// Create middleware with your Engine
const apiRoutes = publicodesAPI(
  new Engine(
    parse(`
prix:
prix . carottes: 2€/kg
prix . champignons: 5€/kg
prix . avocat: 2€/avocat
dépenses primeur:
  formule:
    somme:
      - prix . carottes * 1.5 kg
      - prix . champignons * 500g
      - prix . avocat * 3 avocat
`)
  )
);

// Basic routes usage (/evaluate, /rules, etc.)
router.use(apiRoutes);

// Or use with specific route prefix (/v1/evaluate, /v1/rules, etc.)
router.use("/v1", apiRoutes);

router.get("/", (ctx) => {
  ctx.body = "See https://publi.codes/api-rest for the list of routes";
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("listening on port:", port);
});
