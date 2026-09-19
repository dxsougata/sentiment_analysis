import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import List, Dict, Union

class SentimentClassifier:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()

    def _load_model(self):
        # We use a singleton pattern or lazy loading to avoid multiple loads
        if self.tokenizer is None or self.model is None:
            self.tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
            self.model = AutoModelForSequenceClassification.from_pretrained("assemblyai/distilbert-base-uncased-sst2")
            self.model.to(self.device)
            self.model.eval()

    def predict(self, text: str) -> Dict[str, float]:
        """Predicts sentiment for a single text."""
        tokenized_text = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        input_ids = tokenized_text.input_ids.to(self.device)
        attention_mask = tokenized_text.attention_mask.to(self.device)

        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits

        probs = F.softmax(logits, dim=1).squeeze()
        # sst2 is binary: 0=negative, 1=positive
        positive_prob = probs[1].item()
        negative_prob = probs[0].item()
        
        return {
            "positive_probability": positive_prob,
            "negative_probability": negative_prob,
            "sentiment": "Positive" if positive_prob > negative_prob else "Negative"
        }
        
    def predict_batch(self, texts: List[str]) -> List[Dict[str, Union[float, str]]]:
        """Predicts sentiment for a batch of texts."""
        if not texts:
            return []
            
        tokenized_texts = self.tokenizer(texts, return_tensors="pt", padding=True, truncation=True)
        
        input_ids = tokenized_texts.input_ids.to(self.device)
        attention_mask = tokenized_texts.attention_mask.to(self.device)

        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits

        probs = F.softmax(logits, dim=1)
        
        results = []
        for prob in probs:
            pos_p = prob[1].item()
            neg_p = prob[0].item()
            results.append({
                "positive_probability": pos_p,
                "negative_probability": neg_p,
                "sentiment": "Positive" if pos_p > neg_p else "Negative"
            })
            
        return results

# Create a singleton instance to be used across the app
classifier_service = SentimentClassifier()
