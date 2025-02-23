from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import uvicorn

from api.services.chat_completions import stream_chat_completions

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


@app.get("/api/py/hello")
def hello_fast_api():
    return {"message": "Hello from FastAPI."}


@app.get("/api/py/hello/hello")
def hello_fast_api():
    return {"message": "Hello from FastAPI. Hello again!"}


@app.post("/api/py/chat/completions")
def chat_completions(payload: dict):
    return StreamingResponse(content=stream_chat_completions(payload))


if __name__ == "__main__":
    uvicorn.run(app=app, host=None, port=8000)
