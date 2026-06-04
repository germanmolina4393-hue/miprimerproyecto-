"""
LightRAG con Claude (Anthropic) — demo básico
Uso:
  1. Pon tu API key: export ANTHROPIC_API_KEY=sk-ant-...
  2. Ejecuta: python lightrag_demo.py
"""

import asyncio
import os
from lightrag import LightRAG, QueryParam
from lightrag.llm.anthropic import claude_3_haiku_complete, anthropic_embed
from lightrag.llm.openai import openai_embed
from lightrag.utils import EmbeddingFunc
import numpy as np

# Directorio donde LightRAG guarda el grafo y el índice
WORKING_DIR = "./lightrag_storage"
os.makedirs(WORKING_DIR, exist_ok=True)

# Texto de ejemplo — reemplázalo con tu propio contenido
TEXTO_EJEMPLO = """
LightRAG es un sistema de Retrieval-Augmented Generation desarrollado por la
Universidad de Hong Kong. Combina la búsqueda vectorial tradicional con grafos
de conocimiento para responder preguntas con mayor contexto y precisión.

Sus principales características son:
- Indexado mediante grafos de entidades y relaciones
- Cuatro modos de búsqueda: naive, local, global e hybrid
- Soporte para múltiples LLMs: Claude, GPT, Ollama, Gemini
- API REST y Web UI incluidos
- Compatible con PostgreSQL, Neo4j, Redis y más

El modo hybrid combina búsqueda local (entidades cercanas) con global
(relaciones de alto nivel), ofreciendo los mejores resultados en la mayoría
de los casos.
"""


async def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: Falta la variable de entorno ANTHROPIC_API_KEY")
        print("Ejecuta: export ANTHROPIC_API_KEY=sk-ant-...")
        return

    print("Iniciando LightRAG con Claude Haiku...")

    rag = LightRAG(
        working_dir=WORKING_DIR,
        llm_model_func=claude_3_haiku_complete,  # Claude Haiku: rápido y económico
        llm_model_max_async=2,
        llm_model_max_token_size=8192,
        enable_llm_cache=True,  # Cachea respuestas para ahorrar llamadas
    )

    await rag.initialize_storages()

    print("Indexando documento de ejemplo...")
    await rag.ainsert(TEXTO_EJEMPLO)
    print("Documento indexado.")

    preguntas = [
        "¿Qué es LightRAG?",
        "¿Cuáles son los modos de búsqueda disponibles?",
        "¿Qué bases de datos soporta LightRAG?",
    ]

    for pregunta in preguntas:
        print(f"\n Pregunta: {pregunta}")
        respuesta = await rag.aquery(
            pregunta,
            param=QueryParam(mode="hybrid"),  # hybrid = mejor calidad
        )
        print(f" Respuesta: {respuesta}")


if __name__ == "__main__":
    asyncio.run(main())
