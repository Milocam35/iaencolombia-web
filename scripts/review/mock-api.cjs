/* eslint-disable @typescript-eslint/no-require-imports -- Local-only, read-only test fixture server. */
const http = require("node:http");
const items = [
  {
    id: "21e97a325f844cbbb180007944f8bc56",
    slug: "cuando-un-agente-de-ia-actua-en-nombre-de-su-empresa-21e97a325f844cbbb180007944f8bc56",
    edition_number: 2,
    title: "Cuando un agente de IA actúa en nombre de su empresa.",
    summary:
      "Los agentes de inteligencia artificial pueden ayudar a realizar tareas. Conviene definir qué pueden hacer por su cuenta y qué decisiones necesitan la aprobación de una persona.",
    date: "2026-10-27",
  },
  {
    id: "4228750506f54cf2ab45296449554d10",
    slug: "que-deberia-quedar-despues-de-un-curso-de-inteligencia-artificial-4228750506f54cf2ab45296449554d10",
    edition_number: 1,
    title:
      "¿Qué debería quedar después de un curso de inteligencia artificial?",
    summary:
      "La ampliación de la formación digital abre oportunidades para Colombia. Aprovecharlas exige acompañar lo aprendido hasta su aplicación en el aula y en el trabajo.",
    date: "2026-10-26",
  },
].map((x) => ({
  ...x,
  published_at: x.date + "T12:00:00-05:00",
  first_published_at: x.date + "T12:00:00-05:00",
  url: "/newsletters/" + x.slug,
  revision_id: "local-review",
  version: 1,
  content_markdown:
    "Vista local de pruebas. El artículo íntegro permanece en la publicación oficial.",
}));
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "GET") {
      res.writeHead(405);
      return res.end(
        JSON.stringify({ detail: "Envíos deshabilitados en revisión local" }),
      );
    }
    const u = new URL(req.url, "http://localhost");
    if (u.pathname === "/public/newsletters") {
      res.end(JSON.stringify(items));
      return;
    }
    const item = items.find(
      (x) => u.pathname === "/public/newsletters/" + x.slug,
    );
    if (item) {
      res.end(JSON.stringify(item));
      return;
    }
    res.writeHead(404);
    res.end("{}");
  })
  .listen(4399, "127.0.0.1", () =>
    console.log(
      "API de lectura simulada: http://127.0.0.1:4399; POST bloqueado",
    ),
  );
