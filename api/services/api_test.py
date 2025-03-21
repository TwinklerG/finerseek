import os
import requests


API_KEY = os.environ.get("API_KEY")

url = "https://api.siliconflow.cn/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def test_api():
    # 构建一个简单的请求负载
    payload = {
        "model": "Qwen/QwQ-32B",
        "messages": [
            {
                "role": "user",
                "content": f"中国大模型行业近年来发展迅速，吸引了大量投资和人才,中国大模型行业在2025年将面临哪些机会和挑战？"
            }
        ],
        "stream": False,
        "max_tokens": 512,
        "stop": None,
        "temperature": 0.7,
        "top_p": 0.7,
        "top_k": 50,
        "frequency_penalty": 0.5,
        "n": 1,
        "response_format": {"type": "text"},
        "tools": [
            {
                "type": "function",
                "function": {
                    "description": "<string>",
                    "name": "<string>",
                    "parameters": {},
                    "strict": False
                }
            }
        ]
    }
    try:
        # 发送 POST 请求
        response = requests.post(url, json=payload, headers=headers)

        # 检查响应状态码
        if response.status_code == 200:
            print("请求成功，响应内容如下：")
            print(response.json())
        else:
            print(f"请求失败，状态码: {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"请求过程中出现错误: {e}")


if __name__ == "__main__":
    test_api()