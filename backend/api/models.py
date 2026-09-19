from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ReviewPrediction(BaseModel):
    review_text: str
    positive_probability: float
    negative_probability: float
    sentiment: str

class ProductSummary(BaseModel):
    product_id: str
    total_reviews: int
    average_positive_prob: float
    average_negative_prob: float
    sentiment_distribution: Dict[str, int]
    reviews: List[ReviewPrediction]

class UploadResponse(BaseModel):
    message: str
    products: List[ProductSummary]

class AnalyzeUrlRequest(BaseModel):
    url: str = Field(..., description="The URL of the product to scrape reviews from.")

class ChatRequest(BaseModel):
    product_id: str = Field(..., description="The ID of the product to analyze.")
    question: str = Field(..., description="The question to ask the AI Agent.")
    context_reviews: List[str] = Field(default=[], description="The list of reviews to act as context for the agent.")

class ChatResponse(BaseModel):
    answer: str
