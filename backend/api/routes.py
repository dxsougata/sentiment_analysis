from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.api.models import UploadResponse, ProductSummary, ReviewPrediction, ChatRequest, ChatResponse, AnalyzeUrlRequest
from backend.services.data_service import data_service
from backend.services.classifier import classifier_service
from backend.services.agent import agent_service

MAX_UPLOAD_BYTES = 15 * 1024 * 1024

router = APIRouter()


@router.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV containing review text (optional product id, date, rating).
    Returns sentiment analysis grouped by product.
    """
    filename = (file.filename or "").lower()
    if not filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV (.csv). Excel is not supported yet.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File is too large. Maximum size is 15MB.")

    try:
        records = data_service.parse_csv(contents)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

    grouped_reviews = data_service.group_by_product(records)
    product_summaries = []

    for product_id, items in grouped_reviews.items():
        texts = [item["review_text"] for item in items]
        predictions = classifier_service.predict_batch(texts)

        review_preds = []
        pos_count = 0
        neg_count = 0
        sum_pos_prob = 0.0
        sum_neg_prob = 0.0

        for item, pred in zip(items, predictions):
            date_val = item.get("date") or None
            if date_val == "":
                date_val = None
            rating_val = item.get("rating") or None
            if rating_val == "":
                rating_val = None

            review_preds.append(ReviewPrediction(
                review_text=item["review_text"],
                positive_probability=pred["positive_probability"],
                negative_probability=pred["negative_probability"],
                sentiment=pred["sentiment"],
                date=date_val,
                rating=rating_val,
            ))
            sum_pos_prob += pred["positive_probability"]
            sum_neg_prob += pred["negative_probability"]

            if pred["sentiment"] == "Positive":
                pos_count += 1
            else:
                neg_count += 1

        total_reviews = len(items)

        product_summaries.append(ProductSummary(
            product_id=product_id,
            total_reviews=total_reviews,
            average_positive_prob=sum_pos_prob / total_reviews if total_reviews > 0 else 0,
            average_negative_prob=sum_neg_prob / total_reviews if total_reviews > 0 else 0,
            sentiment_distribution={"Positive": pos_count, "Negative": neg_count},
            reviews=review_preds,
        ))

    return UploadResponse(
        message=f"Successfully processed {len(records)} reviews across {len(product_summaries)} products.",
        products=product_summaries,
    )


@router.post("/analyze-url")
async def analyze_url(request: AnalyzeUrlRequest):
    raise HTTPException(status_code=501, detail="URL scraping is not yet implemented.")


@router.post("/agent/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    if not request.context_reviews:
        raise HTTPException(status_code=400, detail="Must provide context_reviews to chat about.")

    max_reviews = 100
    reviews_to_use = request.context_reviews[:max_reviews]
    context_text = "\n".join([f"- {r}" for r in reviews_to_use])
    answer = agent_service.chat_with_context(context_text, request.question)
    return ChatResponse(answer=answer)
