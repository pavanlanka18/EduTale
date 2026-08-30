import uuid
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status

from app.schemas.story import DocumentUploadResponse
from app.core.database import db
from rag.document_loader import document_loader, TextExtractionError
from rag.chunker import text_chunker
from rag.embeddings import embedding_engine
from rag.vector_store import vector_store


router = APIRouter(prefix="/documents", tags=["documents"])


def get_vector_store():
    return vector_store


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
):
    extracted_text = ""
    filename = "pasted_notes.txt"

    if file:
        filename = file.filename or "uploaded_file"
        file_bytes = await file.read()
        try:
            extracted_text = document_loader.load_from_bytes(file_bytes, filename)
        except TextExtractionError as e:
            if "Corrupted" in str(e) or "invalid PDF" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="This file could not be opened as a PDF. It may be corrupted or password-protected."
                )
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="This PDF contains no readable text and OCR could not read it. It may be a scanned image of poor quality — try a clearer scan or paste the text directly."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="This file could not be opened as a PDF. It may be corrupted or password-protected."
            )
    elif text and text.strip():
        extracted_text = text.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a document file or raw text input is required."
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This PDF contains no readable text and OCR could not read it. It may be a scanned image of poor quality — try a clearer scan or paste the text directly."
        )

    document_id = f"doc_{uuid.uuid4().hex[:12]}"
    chunks = text_chunker.chunk_text(extracted_text, source_id=document_id)

    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This PDF contains no readable text and OCR could not read it. It may be a scanned image of poor quality — try a clearer scan or paste the text directly."
        )

    texts = [c["text"] for c in chunks]
    embeddings = embedding_engine.embed_batch(texts)
    vector_store.add_chunks(chunks, embeddings)

    db.create_document(
        document_id=document_id,
        data={
            "filename": filename,
            "content": extracted_text,
            "chunk_count": len(chunks),
        }
    )

    return DocumentUploadResponse(
        document_id=document_id,
        filename=filename,
        chunk_count=len(chunks),
    )
