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
        "messages": [
            {
                "role": "user",
                "content": "这是一个测试消息"
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