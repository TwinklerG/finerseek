import os, requests, json

API_KEY = os.environ.get("API_KEY")

url = "https://api.siliconflow.cn/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# 新定义一个RAG问答机器人函数
from pymilvus import MilvusClient
from sentence_transformers import SentenceTransformer

# RAG函数：检索Milvus数据库并结合大模型生成回复
def rag_qa(payload, top_k=3):
    query = payload["messages"][-1]["content"]

    # 连接Milvus数据库
    client = MilvusClient("./milvus_demo.db")
    collection_name = "text_collection"

    # 编码用户的问题
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query)

    # 在Milvus中进行相似性搜索
    results = client.search(
        collection_name=collection_name,
        data=[query_embedding.tolist()],
        limit=top_k,
        output_fields=["text"]
    )

    # 组合检索结果为上下文
    context = "\n---\n".join([hit["entity"]["text"] for hit in results[0]])

    # 修改payload中的用户问题，结合上下文构建prompt
    payload["messages"][-1]["content"] = f"根据以下内容回答问题:\n{context}\n\n问题：{query}\n回答："

    # 调用原有的API接口生成回复
    response = requests.request("POST", url, json=payload, headers=headers, stream=True)
    return response


def stream_chat_completions(payload: dict):
    # response = requests.request("POST", url, json=payload, headers=headers, stream=True)
    response = rag_qa(payload)

    if response.status_code == 200:
        think = True
        yield "<blockquote>\n"
        for line in response.iter_lines():
            line = line[6:].decode("utf-8")
            line.strip()
            try:
                data = json.loads(line)
                delta = data["choices"][0]["delta"]
                # print(delta)
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
    else:
        yield "API error"
