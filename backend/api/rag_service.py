# backend/api/rag_service.py

import faiss
import os
from sentence_transformers import SentenceTransformer
from langchain_community.llms import Ollama
from langchain.docstore import InMemoryDocstore
from langchain.vectorstores import FAISS
from langchain.schema import Document
from dotenv import load_dotenv
load_dotenv()  # will pick up backend/.env if run from project rooti wan
# 1. Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# 2. Initialize FAISS index
dimension = 384  # embedding size of all-MiniLM-L6-v2
faiss_index = faiss.IndexFlatL2(dimension)
vectorstore = FAISS(embedding_model.encode, faiss_index, InMemoryDocstore({}), {})

# 3. Load LLM (Ollama must be installed and running locally)
llm = Ollama(model="llama3")  # you can also use mistral, gemma, etc.

def add_documents(docs):
    """Add text documents to the FAISS index"""
    documents = [Document(page_content=doc) for doc in docs]
    vectorstore.add_documents(documents)

def query_rag(user_query: str):
    """Search FAISS and use Ollama to answer"""
    # Search relevant documents
    docs = vectorstore.similarity_search(user_query, k=3)
    context = "\n".join([d.page_content for d in docs])

    # Build prompt
    prompt = f"""
    You are a helpful AI health assistant.
    Use the following context to answer the question:

    Context:
    {context}

    Question:
    {user_query}

    Answer:
    """

    # Generate response
    response = llm(prompt)
    return response
