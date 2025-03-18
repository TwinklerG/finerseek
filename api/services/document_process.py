import io
import os
import pandas as pd
from fastapi import FastAPI, UploadFile
from pymilvus import MilvusClient
from PyPDF2 import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer

# 连接 Milvus Lite 数据库
client = MilvusClient("./milvus_demo.db")
collection_name = "text_collection"
model = SentenceTransformer('all-MiniLM-L6-v2')

# 定义集合
def create_collection():
    try:
        client.create_collection(
            collection_name="text_collection",
            dimension=384,
            auto_id=True
        )
    except Exception as e:
        # 若集合已存在则忽略
        pass

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
        reader = PdfReader(file_path)
        return "".join([page.extract_text() for page in reader.pages])
    elif ext == '.docx':
        doc = Document(file_path)
        return "".join([p.text for p in doc.paragraphs])
    elif ext == '.csv':
        df = pd.read_csv(file_path)
        return "\n".join(df.iloc[:,0].dropna().astype(str))
    elif ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

# 处理并存储数据
def process_and_store(file_path):
    text = extract_text(file_path)
    if text:
        create_collection()
        chunks = split_text(text)
        embeddings = model.encode(chunks)
        data = [{"vector": emb.tolist(), "text": chunk} for chunk, emb in zip(chunks, embeddings)]
        client.insert(collection_name=collection_name, data=data)
        return "Success"
    return "Failed"
