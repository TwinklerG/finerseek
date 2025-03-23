import io
import os
import pandas as pd
import openpyxl
from fastapi import FastAPI, UploadFile
from pymilvus import MilvusClient, DataType
from PyPDF2 import PdfReader
from docx import Document
# from sentence_transformers import SentenceTransformer
from pymilvus.model.hybrid import BGEM3EmbeddingFunction
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)


# 调用更好的文件处理函数
from api.services.extract_ultils import *
import shutil

# 提取 PDF 文件的文本
def pdf_text_generation(file_path):
    # 提取文件名
    file_name = os.path.basename(file_path)
    cache_folder = f"./tmp/{file_name}.cache"
    input_folder = os.path.join(cache_folder, "input")
    output_folder = os.path.join(cache_folder, "output")

    # 创建缓存文件夹和输入输出文件夹
    os.makedirs(input_folder, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)

    # 复制文件到输入文件夹
    try:
        shutil.copy2(file_path, input_folder)
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return None
    except Exception as e:
        print(f"Error: An unexpected error occurred while copying the file: {e}")
        return None

    # 新增
    batch_convert_word_to_pdf(input_folder, input_folder) #处理文件夹中的所有 PDF 文件
    process_folder(input_folder,input_folder,output_folder, output_folder) # 处理文件夹中的所有 Word 和 PDF 文件

    # 读取 text.txt 文件内容
    text_file_path = os.path.join(output_folder, "text.txt")
    try:
        with open(text_file_path, 'r', encoding='utf-8') as file:
            text = file.read()
    except FileNotFoundError:
        print(f"Error: The file {text_file_path} was not found.")
        text = ""
    except Exception as e:
        print(f"Error: An unexpected error occurred while reading the file: {e}")
        text = ""

    combined_text = text

    # 新增：处理CSV文件
    for file in os.listdir(output_folder):
        if file.lower().endswith('.csv'):
            csv_path = os.path.join(output_folder, file)
            combined_text += csv_text_generation(csv_path)

    # 新增：处理图片文件
    for file in os.listdir(output_folder):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            img_path = os.path.join(output_folder, file)
            combined_text += img_text_generation(img_path)

    return combined_text

# 提取 Word 文件的文本
def doc_text_generation(file_path):
    return pdf_text_generation(file_path)

# 提取 CSV 文件的文本
def csv_text_generation(file_path):
    try:
        df = pd.read_csv(file_path)
        text = df.to_markdown(index=True)
        return text
    except Exception as e:
        print("An error occurred while processing the CSV file:", str(e))
        return ""

# 提取 Excel 文件的文本
def excel_text_generation(file_path):
    """
    从给定Excel文件中提取所有sheet的数据，转换成Markdown格式文本。

    参数:
        file_path (str): Excel文件的路径。

    返回:
        str: 提取出的所有sheet的Markdown文本内容。
    """
    try:
        # 读取Excel文件的所有sheet
        sheets = pd.read_excel(file_path, sheet_name=None)
        markdown_texts = []

        # 遍历所有sheet，逐个转换成Markdown
        for sheet_name, df in sheets.items():
            markdown_texts.append(f"## Sheet: {sheet_name}\n")
            markdown_texts.append(df.fillna('').astype(str).to_markdown(index=False))
            markdown_texts.append("\n")  # 增加换行

        # 将所有sheet的Markdown文本拼接起来
        return "\n".join(markdown_texts)

    except Exception as e:
        print("处理Excel文件时发生错误:", str(e))
        return ""
    
# 提取图片文件的文本
def img_text_generation(file_path):
    # 使用大模型生成caption（输出详细而复杂的信息）
    return "Image caption"

# 分块文本函数
def split_text(text, chunk_size=300, overlap=50):
    """
    将文本分割成指定大小的块，并允许指定重叠量。

    Args:
        text (str): 要分割的文本。
        chunk_size (int, optional): 每个块的大小。默认为300。
        overlap (int, optional): 块之间的重叠量。默认为50。

    Returns:
        list: 包含分割后的文本块的列表。

    """
    chunks, start = [], 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

# 提取文件内容函数
def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return pdf_text_generation(file_path)
    elif ext == '.docx':
        return doc_text_generation(file_path)
    elif ext == '.xls' or ext == '.xlsx':
        return excel_text_generation(file_path)
    elif ext == '.csv':
        return csv_text_generation(file_path)
    elif ext == '.jpg' or ext == '.jpeg' or ext == '.png':
        return img_text_generation(file_path)
    elif ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

# 处理并存储数据
def process_and_store(file_path):
    # 提取文件内容
    text = extract_text(file_path)
    if text:
        chunks = split_text(text)

        # 存储数据（TODO）
        filename = os.path.basename(file_path)

        # Embedding 模型定义
        bge_m3_ef = BGEM3EmbeddingFunction(
            model_name='BAAI/bge-m3',  # Specify the model name
            device='cpu',  # Specify the device to use, e.g., 'cpu' or 'cuda:0'
            use_fp16=False  # Specify whether to use fp16. Set to `False` if `device` is `cpu`.
        )

        doc_embeddings = bge_m3_ef(chunks)

        # 准备批量插入的数据
        texts = []
        filenames = []
        sparse_vectors = []
        dense_vectors = []

        for chunk in chunks:
            # texts.append(chunk)
            filenames.append(filename)
            # sparse_vectors.append(emb['sparse'])
            # dense_vectors.append(emb['dense'])

        data = [
            chunks,
            filenames,
            doc_embeddings["sparse"],
            doc_embeddings["dense"],
        ]

        # 连接 Milvus Lite 数据库
        connections.connect(uri="./milvus.db")

        col_name = "hybrid_demo"
        col = Collection(col_name)
        col.load()

        # 批量插入数据
        col.insert(data=data)

        col.release()

        # 关闭连接
        connections.disconnect(alias="default")

        return "Success"
    return "Failed"

# 调用示例
if __name__ == '__main__':
    file_path = "tmp/维信诺.docx"  # 替换为实际文件路径
    result = process_and_store(file_path)
    print(result)
