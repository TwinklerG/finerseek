import json
from openai import OpenAI

def test_openai_image_description():
    client = OpenAI(
        api_key="sk-bmihnzltkvicekdpefzbtndgaknwirvjapdkoxfjmubsctao",  # 从https://cloud.siliconflow.cn/account/ak获取
        base_url="https://api.siliconflow.cn/v1"
    )

    response = client.chat.completions.create(
        model="Qwen/Qwen2-VL-72B-Instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/dog.png"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Describe the image."
                    }
                ]
            }
        ],
        stream=True
    )

    print("Streaming response:")
    for chunk in response:
        chunk_message = chunk.choices[0].delta.content
        print(chunk_message, end='', flush=True)

# 调用测试函数
test_openai_image_description()
