from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.story import StoryRequest, StoryResponse
from app.services.story_service import StoryService, get_story_model
from app.api.routes.documents import get_vector_store
from models.story_model import StoryModel


def get_story_service(model: StoryModel = Depends(get_story_model)) -> StoryService:
    return StoryService(model)


router = APIRouter(prefix="/story", tags=["story"])


@router.post("/generate", response_model=StoryResponse)
async def generate_story(
    request: StoryRequest,
    service: StoryService = Depends(get_story_service),
):
    try:
        retrieved_context = None
        retrieved_chunks_count = 0

        # Perform RAG retrieval if document_id and topic are provided
        if request.document_id and request.topic:
            v_store = get_vector_store()
            from rag.embeddings import embedding_engine
            query_vector = embedding_engine.embed_text(request.topic)
            results = v_store.search(
                query_vector=query_vector,
                top_k=4,
                source_id_filter=request.document_id,
            )


            if not results:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Topic '{request.topic}' was not found in your uploaded material.",
                )

            retrieved_chunks_count = len(results)
            retrieved_context = "\n\n".join([chunk["text"] for chunk in results])


        return service.generate(
            request,
            context=retrieved_context,
            retrieved_chunks=retrieved_chunks_count,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Story generation service unavailable: {str(e)}",
        )


@router.get("/health")
async def health(
    service: StoryService = Depends(get_story_service),
):
    return {"model_available": service.health()}

