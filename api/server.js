const http = require("http");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://ollama:11434";
const MODEL = process.env.MODEL;
const PORT = process.env.PORT || 8080;

if (!MODEL) {
  console.error("MODEL is required");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/generate") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { prompt } = JSON.parse(body);
        const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: MODEL, prompt, stream: false }),
          signal: AbortSignal.timeout(120000),
        });
        const data = await ollamaRes.json();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ response: data.response || "No response." }));
      } catch (err) {
        console.error("Error:", err.message);
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "backend unavailable" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Funkyboy API running on :${PORT}`);
  console.log(`Backend: ${OLLAMA_URL} | Model: ${MODEL}`);
});
