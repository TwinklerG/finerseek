import os, requests, json
from pymilvus import MilvusClient
# from sentence_transformers import SentenceTransformer
from pymilvus.model.hybrid import BGEM3EmbeddingFunction
from pymilvus import AnnSearchRequest, WeightedRanker
from pymilvus import connections, Collection

API_KEY = os.environ.get("API_KEY")

url = "https://api.siliconflow.cn/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

def dense_search(col, query_dense_embedding, limit=10):
    search_params = {"metric_type": "IP", "params": {}}
    res = col.search(
        [query_dense_embedding],
        anns_field="dense_vector",
        limit=limit,
        output_fields=["text"],
        param=search_params,
    )[0]
    return [hit.get("text") for hit in res]

def sparse_search(col, query_sparse_embedding, limit=10):
    search_params = {
        "metric_type": "IP",
        "params": {},
    }
    res = col.search(
        [query_sparse_embedding],
        anns_field="sparse_vector",
        limit=limit,
        output_fields=["text"],
        param=search_params,
    )[0]
    return [hit.get("text") for hit in res]

def hybrid_search(
    col,
    query_dense_embedding,
    query_sparse_embedding,
    sparse_weight=1.0,
    dense_weight=1.0,
    limit=10,
):
    """
    执行混合搜索，结合稠密向量和稀疏向量进行查询。

    Args:
        col (Collection): Milvus集合对象，用于执行搜索操作。
        query_dense_embedding (numpy.ndarray): 用于查询的稠密向量。
        query_sparse_embedding (numpy.ndarray): 用于查询的稀疏向量。
        sparse_weight (float, optional): 稀疏向量的权重，默认值为1.0。
        dense_weight (float, optional): 稠密向量的权重，默认值为1.0。
        limit (int, optional): 返回结果的数量限制，默认值为10。

    Returns:
        List[str]: 搜索结果中的文本内容列表。

    """
    dense_search_params = {"metric_type": "IP", "params": {}}
    dense_req = AnnSearchRequest(
        [query_dense_embedding], "dense_vector", dense_search_params, limit=limit
    )
    sparse_search_params = {"metric_type": "IP", "params": {}}
    sparse_req = AnnSearchRequest(
        [query_sparse_embedding], "sparse_vector", sparse_search_params, limit=limit
    )
    rerank = WeightedRanker(sparse_weight, dense_weight)
    res = col.hybrid_search(
        [sparse_req, dense_req], rerank=rerank, limit=limit, output_fields=["text"]
    )[0]
    return [hit.get("text") for hit in res]

# RAG函数：检索Milvus数据库并结合大模型生成回复
def rag_qa(payload, top_k=3):
    query = payload["messages"][-1]["content"]

    # 连接Milvus数据库
    # Connect to Milvus given URI
    connections.connect(uri="./milvus.db")
    collection_name = "hybrid_demo"
    col = Collection(collection_name)
    col.load()

    # 编码用户的问题
    bge_m3_ef = BGEM3EmbeddingFunction(
        model_name='BAAI/bge-m3', # Specify the model name
        device='cpu', # Specify the device to use, e.g., 'cpu' or 'cuda:0'
        use_fp16=False # Specify whether to use fp16. Set to `False` if `device` is `cpu`.
    )

    query_embeddings = bge_m3_ef.encode_queries([query])

    # 在Milvus中进行相似性搜索
    # 进行 hybrid 检索
    dense_results = dense_search(col, query_embeddings["dense"][0])
    sparse_results = sparse_search(col, query_embeddings["sparse"]._getrow(0))
    hybrid_results = hybrid_search(
        col,
        query_embeddings["dense"][0],
        query_embeddings["sparse"]._getrow(0),
        sparse_weight=0.7,
        dense_weight=1.0,
    )

    col.release()
    connections.disconnect(alias="default")

    # 确保 dense_results、sparse_results 和 hybrid_results 的元素都是字符串类型
    all_results = list(map(str, dense_results + sparse_results + hybrid_results))
    
    # 测试检索功能
    # print(all_results)

    # 将结果拼接为上下文字符串
    context = "\n---\n".join(all_results)
    
    # 修改 payload 中的用户问题，结合上下文构建 prompt
    payload["messages"][-1]["content"] = f"根据以下内容回答问题:\n{context}\n\n问题：{query}\n回答："
    
    # 调用原有的API接口生成回复
    response = requests.request("POST", url, json=payload, headers=headers, stream=True)
    return response


def stream_chat_completions(payload: dict):
    # response = requests.request("POST", url, json=payload, headers=headers, stream=True)
    response = rag_qa(payload)

    print("响应内容：")
    for line in response.iter_lines():
        if line:
            print(line.decode("utf-8"))

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


# 调用示例
if __name__ == '__main__':
    # 模拟一个聊天 payload
    payload = {
        "messages": [
            {"role": "system", "content": "你是一个知识问答助手"},
            {"role": "user", "content": "什么是向量数据库？"}
        ],
        "model":"deepseek-ai/DeepSeek-R1-Distill-Llama-8B"
    }

    # 调用 rag_qa 函数
    response = rag_qa(payload)

    # 输出返回结果（注意这里是流式返回，所以我们一行一行打印）
    print("响应内容：")
    for line in response.iter_lines():
        if line:
            print(line.decode("utf-8"))