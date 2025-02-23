import os, requests, json

API_KEY = os.environ.get("API_KEY")

url = "https://api.siliconflow.cn/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def stream_chat_completions(payload: dict):
    response = requests.request("POST", url, json=payload, headers=headers, stream=True)

    if response.status_code == 200:
        think = True
        yield "<blockquote>\n"
        for line in response.iter_lines():
            line = line[6:].decode("utf-8")
            line.strip()
            try:
                data = json.loads(line)
                delta = data["choices"][0]["delta"]
                print(delta)
                if delta["reasoning_content"] != None:
                    # print(delta["reasoning_content"], end="")
                    yield delta["reasoning_content"]
                else:
                    if think:
                        yield "</blockquote>"
                        think = False
                    # print(delta["content"])
                    yield delta["content"]
                # print(delta)
            except Exception:
                pass
            import time
            time.sleep(0)
