from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.api.models import UploadResponse, ProductSummary, ReviewPrediction, ChatRequest, ChatResponse, AnalyzeUrlRequest
from backend.services.data_service import data_service
from backend.services.classifier import classifier_service
from backend.services.agent import agent_service
from typing import List

router = APIRouter()

@router.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file containing 'Product_ID' and 'Review_Text'.
    Returns sentiment analysis grouped by product.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
        
    try:
        contents = await file.read()
        records = data_service.parse_csv(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")
        
    grouped_reviews = data_service.group_by_product(records)
    
    product_summaries = []
    
    for product_id, texts in grouped_reviews.items():
        # Predict in batch for efficiency
        predictions = classifier_service.predict_batch(texts)
        
        review_preds = []
        pos_count = 0
        neg_count = 0
        sum_pos_prob = 0.0
        sum_neg_prob = 0.0
        
        for text, pred in zip(texts, predictions):
            review_preds.append(ReviewPrediction(
                review_text=text,
                positive_probability=pred["positive_probability"],
                negative_probability=pred["negative_probability"],
                sentiment=pred["sentiment"]
            ))
            sum_pos_prob += pred["positive_probability"]
            sum_neg_prob += pred["negative_probability"]
            
            if pred["sentiment"] == "Positive":
                pos_count += 1
            else:
                neg_count += 1
                
        total_reviews = len(texts)
        
        product_summaries.append(ProductSummary(
            product_id=product_id,
            total_reviews=total_reviews,
            average_positive_prob=sum_pos_prob / total_reviews if total_reviews > 0 else 0,
            average_negative_prob=sum_neg_prob / total_reviews if total_reviews > 0 else 0,
            sentiment_distribution={"Positive": pos_count, "Negative": neg_count},
            reviews=review_preds
        ))
        
    return UploadResponse(
        message=f"Successfully processed {len(records)} reviews across {len(product_summaries)} products.",
        products=product_summaries
    )

@router.post("/analyze-url")
async def analyze_url(request: AnalyzeUrlRequest):
    """
    Placeholder endpoint for scraping reviews from a URL.
    """
    # This requires a scraping implementation (e.g., beautifulsoup or an API)
    # For now, we return a 501 Not Implemented to inform the frontend team it's pending.
    raise HTTPException(status_code=501, detail="URL scraping is not yet implemented.")

@router.post("/agent/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Chat with the Gemini agent about a specific product's reviews.
    """
    if not request.context_reviews:
        raise HTTPException(status_code=400, detail="Must provide context_reviews to chat about.")
        
    # To avoid exceeding token limits, we might want to truncate or sample reviews if there are thousands.
    # For this prototype, we'll join them into a single string.
    # A safe limit for Gemini Pro is quite large, but it's good practice to limit.
    max_reviews = 100 
    reviews_to_use = request.context_reviews[:max_reviews]
    
    context_text = "\n".join([f"- {r}" for r in reviews_to_use])
    
    answer = agent_service.chat_with_context(context_text, request.question)
    
    return ChatResponse(answer=answer)
