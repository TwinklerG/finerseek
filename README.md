<h1 align="center">Finerseek</h1>

This is a hybrid project of Next.js and FastAPI.

## 🚀Quick Start

Prerequisites: Nodejs, uv[^1]

**development**

```shell
npm install
npm run dev
```

**About Milvus**

How to set the environment?   
- Only MacOS or Linux is supported.  

Packages:
```bash
pip install --upgrade pymilvus milvus_model "pymilvus[model] milvus_model"
```

How to init the database?
```bash
HF_ENDPOINT=https://hf-mirror.com python api/services/database_initiation.py # connect to HuggingFace mirror server
```

**About PDF-extractor**

Linux:
```bash
sudo apt-get update
sudo apt-get install ghostscript
pip install "camelot-py[cv]"
```

**production**

Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

App runs on [localhost:3000](localhost:3000) and all the APIs of FastAPI are maped to [localhost:3000/api/py](localhost:3000/api/py)[^2]

[^1]: An extremely fast Python package and project manager, written in Rust.
[^2]: For more details, refer to `next.config.ts`
