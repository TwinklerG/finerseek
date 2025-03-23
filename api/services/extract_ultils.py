import csv
import camelot
import pdfplumber
import os
import pandas as pd
import gc
# import win32com.client
import fitz  # PyMuPDF
import re
from io import BytesIO

import queue
import os
from docx import Document as DocxDocument
from docx.shared import Inches
from docx.oxml.ns import qn

import os
from docx import Document
import zipfile
from io import BytesIO
import subprocess

"""
1.有无效表格
2.表格有部分格式错误
"""

"""
可提取doc/dcox图片，pdf图片
word文档转化为pdf后再提取表格
1.有无效图片（多个logo）
"""


####################################################################################################
# 提取 Word 文档中的图片
####################################################################################################

# def extract_images_from_docx(filepath, filename):
#     """
#     提取单个 Word 文件中的所有图片并保存
#     :param filepath: 单个 Word 文件的路径
#     :param filename: 单个 Word 文件的文件名
#     :param output_folder: 提取图片的保存路径
#     """
#     # 确保输出目录存在
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)

#     # 打开 .docx 文件（实际上是一个 zip 压缩包）
#     try:
#         # 使用 zipfile 打开 Word 文件（.docx）
#         with zipfile.ZipFile(filepath, 'r') as docx_zip:
#             # 获取所有图片文件的路径
#             image_files = [f for f in docx_zip.namelist() if f.startswith('word/media/')]

#             # 遍历所有图片文件
#             for i, image_file in enumerate(image_files):
#                 # 提取图片数据
#                 image_data = docx_zip.read(image_file)

#                 # 确定图片的文件名和路径
#                 img_ext = image_file.split('.')[-1]  # 获取图片的扩展名
#                 img_filename = f"{filename}_Image-{i+1}.{img_ext}"
#                 img_path = os.path.join(output_folder, img_filename)

#                 # 保存图片到指定文件夹
#                 with open(img_path, 'wb') as img_file:
#                     img_file.write(image_data)

#                 print(f"✅ 图片已保存: {img_path}")

#     except Exception as e:
#         print(f"❌ 发生错误: {e}")


####################################################################################################
# 提取 PDF 文件中的图片
####################################################################################################

def get_caption(page, img_rect):
    """ 从 PDF 页面中提取靠近图片的文本，作为 caption """
    text = page.get_text("text")  # 提取整页文本
    lines = text.split("\n")  # 分割成行
    caption = None
    
    for line in lines:
        if img_rect.y1 < page.rect.height / 2 and img_rect.y1 - 20 <= page.rect.height / 2:  
            caption = line.strip()
            break

    return caption if caption else None

def pdf2image_with_captions(pdf_path, filename,output_folder):
    """ 提取 PDF 里的图片，并用 caption 作为文件名 """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    pdf = fitz.open(pdf_path)  # 打开 PDF 文件
    image_count = 1
    unique_images = set()  # 用来记录已提取的图片的 xref

    for page_number in range(len(pdf)):  # 遍历每一页
        page = pdf[page_number]
        images = page.get_images(full=True)  # 获取所有图片

        for img_index, img in enumerate(images):
            xref = img[0]  # 图片 ID
            
            # 如果图片已经提取过，跳过
            if xref in unique_images:
                continue

            unique_images.add(xref)  # 标记此图片已提取
            base_image = pdf.extract_image(xref)  # 提取图片数据
            img_bytes = base_image["image"]
            img_ext = base_image["ext"]  # 获取图片格式 (jpg, png, etc.)

            # 获取图片在 PDF 中的位置
            img_rect = fitz.Rect(img[1], img[2], img[3], img[4])
            caption = get_caption(page, img_rect)  # 提取 caption

            # 生成文件名
            if caption:
                safe_caption = re.sub(r'[\/:*?"<>|]', '_', caption[:20])  # 清理非法字符
                img_filename = f"{filename}{safe_caption}-{image_count+1}.{img_ext}"
            else:
                img_filename = f"{filename}_Image-{image_count+1}.png"

            img_path = os.path.join(output_folder, img_filename)

            # 保存图片
            with open(img_path, "wb") as img_file:
                img_file.write(img_bytes)

            print(f"✅ 图片已保存: {img_path}")
            image_count += 1



####################################################################################################
# 示例: 将 Word 文档转换为 PDF
####################################################################################################

import subprocess
import os

def convert_doc_to_pdf(input_path, output_path):
    """
    将 Word 文档转换为 PDF。
    :param input_path: 输入的 Word 文档路径。
    :param output_path: 输出的 PDF 文件路径。
    """
    try:
        # 确保输出路径是一个文件路径
        if os.path.isdir(output_path):
            # 如果 output_path 是目录，生成默认文件名
            output_filename = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
            output_path = os.path.join(output_path, output_filename)

        # 调用 LibreOffice 进行转换
        subprocess.run([
            '/usr/bin/libreoffice',  # LibreOffice 的可执行文件路径
            '--headless',  # 无界面模式
            '--convert-to', 'pdf',  # 转换为 PDF
            input_path,  # 输入的 Word 文档路径
            '--outdir', os.path.dirname(output_path)  # 输出的 PDF 文件目录
        ], check=True)

        # 检查是否生成 PDF 文件
        if os.path.exists(output_path):
            print(f"转换成功: {input_path} -> {output_path}")
        else:
            print(f"转换失败: 未生成 PDF 文件")
    except subprocess.CalledProcessError as e:
        print(f"转换失败: {e}")
    except FileNotFoundError:
        print("未找到 LibreOffice，请确保已安装并正确配置路径。")

# 示例: 处理整个文件夹
def batch_convert_word_to_pdf(input_folder, output_folder):
    """遍历文件夹中的所有 Word 文件并转换为 PDF"""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(".doc") or filename.endswith(".docx"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename.rsplit(".", 1)[0] + ".pdf")
            convert_doc_to_pdf(input_path, output_path)
            
####################################################################################################
# 示例: 提取 PDF 文件中的表格和文字
####################################################################################################

def extract_text_from_pdf(pdf_path):
    """ 提取 PDF 文件中的所有文字 """
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"  # 提取每页文字并换行
        return text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

def save_table_to_csv(table, filename):
    """ 保存表格为CSV文件 """
    try:
        if isinstance(table, camelot.core.Table):
            # 将 Camelot 表格转换为 DataFrame
            df = table.df
        else:
            # 将 pdfplumber 表格转换为 DataFrame
            df = pd.DataFrame(table)
        
        # 强制将字符串保存为文本格式
        for col in df.columns:
            df[col] = df[col].astype(str).apply(lambda x: f"'{x}" if '-' in x and len(x.split('-')) == 3 else x)
            
        
        # 保存为 CSV 文件，并指定格式
        df.to_csv(filename, index=False, encoding='utf-8-sig', quoting=csv.QUOTE_NONNUMERIC)
        print(f"Table saved to {filename}")
    except Exception as e:
        print(f"Error saving table to {filename}: {e}")

def extract_table_with_pdfplumber(pdf_path, page_number):
    """ 使用 pdfplumber 提取单个页面的表格 """
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_number - 1]  # page_number 是从 1 开始的，所以需要减去 1
        table = page.extract_table()
        if table:
            return [table]
        return []

def extract_table_with_camelot(pdf_path, page_number, flavor='lattice'):
    """ 使用 Camelot 提取表格 """
    try:
        tables = camelot.read_pdf(pdf_path, pages=str(page_number), flavor=flavor)
        return tables
    except Exception as e:
        print(f"Error extracting table with Camelot: {e}")
        return []

def extract_tables(pdf_path):
    """ 提取所有表格，先尝试 Camelot，再尝试 pdfplumber """
    all_tables = []
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        for page_number in range(1, total_pages + 1):
            # 先尝试用 Camelot 的 lattice 模式
            tables = extract_table_with_camelot(pdf_path, page_number, flavor='lattice')
            
            if not tables:
                # 如果 Camelot lattice 模式没有找到表格，尝试用 stream 模式
                tables = extract_table_with_camelot(pdf_path, page_number, flavor='stream')
            
            if not tables:
                # 如果 Camelot 仍然没有提取到表格，使用 pdfplumber
                tables = extract_table_with_pdfplumber(pdf_path, page_number)
            
            if tables:
                all_tables.extend(tables)
                
    # **强制释放资源**
    gc.collect()
    
    return all_tables

####################################################################################################
# 示例: 处理文件夹中的所有 Word 和 PDF 文件
####################################################################################################
    
# def process_docx(docx_path,filename):
#     """ 处理 Word 文件 """
#     # 提取图片
#     extract_images_from_docx(docx_path, filename)
    
def process_pdf(file_path,filename,output_folder,input_folder):
    """ 处理 PDF 文件 """
    # 初始化保存文字的变量
    all_text = ""
    
    pdf_path = os.path.join(input_folder, filename)
    print(f"Processing {filename}...")
    
    #提取图片
    pdf2image_with_captions(pdf_path ,filename,output_folder)

    # 提取文字
    text = extract_text_from_pdf(pdf_path)
    if text:
        all_text += f"=== {filename} ===\n{text}\n\n"  # 添加 PDF 文件名作为分隔符
    
    # 提取表格
    tables = extract_tables(pdf_path)
    
    # 保存每个提取的表格到单独的 CSV 文件，文件名包含 PDF 文件名
    for i, table in enumerate(tables):
        csv_filename = os.path.join(output_folder, f"{filename[:-4]}_table_{i+1}.csv")
        save_table_to_csv(table, csv_filename)
        
    # 将提取的文字保存到 text.txt
    output_file = os.path.join(output_folder, "text.txt")
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(all_text)
    print(f"All text saved to {output_file}")
    
def process_folder(input_folder,input_folder_2,output_folder,output_folder_2):
    """ 遍历文件夹中的所有文件，并分类处理 """
    
    for filename in os.listdir(input_folder):
        file_path = os.path.join(input_folder, filename)

        if os.path.isfile(file_path):  # 只处理文件
            # if filename.lower().endswith((".doc", ".docx")):
            #     process_docx(file_path,filename)  # 处理 Word 文件
            if filename.lower().endswith(".pdf"):
                process_pdf(file_path,filename,output_folder,input_folder)  # 处理 PDF 文件
            else:
                print(f"⚠️ 忽略文件: {filename}")  # 非 docx/pdf 文件
    

# # 示例
pdf_folder = "./TestPdf"  # 输入文件夹路径
output_folder = "./tables"  # 输出文件夹路径

batch_convert_word_to_pdf(pdf_folder, pdf_folder) #处理文件夹中的所有 PDF 文件
process_folder(pdf_folder,pdf_folder,output_folder, output_folder) # 处理文件夹中的所有 Word 和 PDF 文件
