from fastapi import FastAPI, UploadFile
from fastapi.responses import StreamingResponse
import uvicorn

from api.services.chat_completions import stream_chat_completions
from api.services.document_process import process_and_store

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


@app.post("/api/py/chat/upload")
async def chat_upload(file: UploadFile):
    print(file.filename)
    import io, os

    # Create tmp folder if it does not exist
    if not os.path.exists("tmp"):
        os.makedirs("tmp")

    io.open(f"tmp/{file.filename}", "wb").write(await file.read())

    result = process_and_store(f"tmp/{file.filename}") # process and store the file (automaticly)

    return result


if __name__ == "__main__":
    uvicorn.run(app=app, host=None, port=8000)
