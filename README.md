# Funkyboy Local Model

Local AI API wrapper. Runs Ollama + GPU behind a simple REST API so clients only need a URL.

## Setup

```bash
cp .env.example .env
# Edit .env to set your model
```

## Commands

```bash
# Start everything
docker compose up -d --build

# Pull a base model (first time only)
docker compose exec ollama ollama pull dolphin-llama3:8b

# Create custom model from Modelfile
docker compose cp Modelfile ollama:/tmp/Modelfile
docker compose exec ollama ollama create dolphin-unleashed -f /tmp/Modelfile

# Stop everything
docker compose down

# Logs
docker compose logs -f api

# Switch model: change MODEL in .env, then
docker compose restart api
```

## API

```
POST /generate
{"prompt": "your question"}

Response: {"response": "..."}
```

## Environment Variables

| Variable | Description |
|---|---|
| `INSTANCE_NAME` | Container name and network prefix |
| `MODEL` | Model to use for generation |
| `PORT` | API port (default: 8080) |
