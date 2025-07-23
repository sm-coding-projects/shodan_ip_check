import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Shodan IP Inspector")

# Serve static assets
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def root():
    return FileResponse("app/static/index.html")

@app.post("/api/query")
async def query(payload: dict):
    """Forward the user‑supplied key + IP to Shodan and relay the JSON."""
    ip  = payload.get("ip")
    key = payload.get("key")
    if not ip or not key:
        raise HTTPException(status_code=400, detail="Both 'ip' and 'key' are required")

    url = f"https://api.shodan.io/shodan/host/{ip}?key={key}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Network error: {exc}") from exc

    if r.status_code != 200:
        # Bubble up Shodan’s error text if available
        try:
            detail = r.json().get("error", r.text)
        except ValueError:
            detail = r.text
        raise HTTPException(status_code=r.status_code, detail=detail)

    return r.json()
