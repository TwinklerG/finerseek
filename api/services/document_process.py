import io
import os
import pandas as pd
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

# 提取 PDF 文件的文本
def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

# 提取 Word 文件的文本
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text
    return text

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
        return extract_text_from_pdf(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    elif ext == '.csv':
        df = pd.read_csv(file_path)
        return "\n".join(df.iloc[:,0].dropna().astype(str))
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
    file_path = "贵州茅台（600519）.pdf"  # 替换为实际文件路径
    result = process_and_store(file_path)
    print(result)
