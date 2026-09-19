import pandas as pd
from typing import List, Dict, Any
from io import BytesIO

class DataService:
    @staticmethod
    def parse_csv(file_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Parses a CSV file containing at least Product_ID and Review_Text columns.
        Returns a list of dictionaries.
        """
        df = pd.read_csv(BytesIO(file_bytes))
        
        # We need to ensure required columns exist. We can try to be flexible with naming.
        # Check for typical column names for product ID and review text
        
        col_lower = {c.lower(): c for c in df.columns}
        
        product_col = None
        if 'product_id' in col_lower: product_col = col_lower['product_id']
        elif 'product' in col_lower: product_col = col_lower['product']
        elif 'asin' in col_lower: product_col = col_lower['asin'] # Amazon specific
        elif 'id' in col_lower: product_col = col_lower['id']
        
        text_col = None
        if 'review_text' in col_lower: text_col = col_lower['review_text']
        elif 'review.text' in col_lower: text_col = col_lower['review.text']
        elif 'text' in col_lower: text_col = col_lower['text']
        elif 'review' in col_lower: text_col = col_lower['review']
        
        if not text_col:
            raise ValueError("Could not find a column containing review text. Expected 'Review_Text', 'Text', or 'Review'.")
            
        if not product_col:
            # If no product ID, we assume all reviews belong to a single "Unknown Product"
            df['Product_ID'] = 'Unknown Product'
            product_col = 'Product_ID'
            
        # Select only the needed columns and drop NA text
        df = df[[product_col, text_col]].dropna(subset=[text_col])
        df = df.rename(columns={product_col: 'product_id', text_col: 'review_text'})
        
        # Convert all product IDs and text to string
        df['product_id'] = df['product_id'].astype(str)
        df['review_text'] = df['review_text'].astype(str)
        
        return df.to_dict(orient='records')
        
    @staticmethod
    def group_by_product(records: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """
        Groups reviews by product ID.
        Returns a dictionary: { "product_id": ["review 1", "review 2"] }
        """
        grouped = {}
        for record in records:
            pid = record['product_id']
            text = record['review_text']
            if pid not in grouped:
                grouped[pid] = []
            grouped[pid].append(text)
        return grouped

data_service = DataService()
