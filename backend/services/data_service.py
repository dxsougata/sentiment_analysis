import pandas as pd
from typing import List, Dict, Any, Optional
from io import BytesIO


def _lower_col_map(columns) -> Dict[str, str]:
    return {str(c).strip().lower(): c for c in columns}


def _pick_column(col_lower: Dict[str, str], aliases: List[str]) -> Optional[str]:
    for alias in aliases:
        if alias in col_lower:
            return col_lower[alias]
    return None


class DataService:
    TEXT_ALIASES = [
        "review_text",
        "reviews.text",
        "review.text",
        "reviewtext",
        "customer_review",
        "customer_reviews",
        "comment",
        "comments",
        "feedback",
        "text",
        "review",
        "content",
        "body",
    ]

    PRODUCT_ALIASES = [
        "product_id",
        "productid",
        "product",
        "asin",
        "sku",
        "item_id",
        "id",
    ]

    DATE_ALIASES = [
        "date",
        "review_date",
        "reviews.date",
        "created_at",
        "timestamp",
        "time",
    ]

    RATING_ALIASES = [
        "rating",
        "reviews.rating",
        "stars",
        "score",
        "star_rating",
    ]

    @staticmethod
    def parse_csv(file_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Parses a CSV with a review-text column (and optional product, date, rating).
        Returns a list of dictionaries with product_id, review_text, date, rating.
        """
        last_error = None
        df = None
        for kwargs in (
            {"encoding": "utf-8", "encoding_errors": "replace", "low_memory": False},
            {"encoding": "latin-1", "low_memory": False},
            {"encoding": "utf-8-sig", "encoding_errors": "replace", "low_memory": False},
        ):
            try:
                df = pd.read_csv(BytesIO(file_bytes), **kwargs)
                break
            except Exception as exc:
                last_error = exc

        if df is None:
            raise ValueError(f"Could not read the CSV file: {last_error}")

        if df.empty:
            raise ValueError("The CSV file has no data rows.")

        col_lower = _lower_col_map(df.columns)

        text_col = _pick_column(col_lower, DataService.TEXT_ALIASES)
        product_col = _pick_column(col_lower, DataService.PRODUCT_ALIASES)
        date_col = _pick_column(col_lower, DataService.DATE_ALIASES)
        rating_col = _pick_column(col_lower, DataService.RATING_ALIASES)

        if not text_col:
            names = ", ".join(str(c) for c in df.columns)
            raise ValueError(
                "Could not find a review text column. "
                "Use Review_Text, Text, Review, Comment, or Feedback. "
                f"Found columns: {names}"
            )

        if product_col == text_col:
            product_col = None

        if not product_col:
            df["Product_ID"] = "Unknown Product"
            product_col = "Product_ID"

        keep = [product_col, text_col]
        if date_col:
            keep.append(date_col)
        if rating_col and rating_col not in keep:
            keep.append(rating_col)

        df = df[keep].dropna(subset=[text_col])
        rename = {product_col: "product_id", text_col: "review_text"}
        if date_col:
            rename[date_col] = "date"
        if rating_col:
            rename[rating_col] = "rating"
        df = df.rename(columns=rename)

        df["product_id"] = df["product_id"].astype(str)
        df["review_text"] = df["review_text"].astype(str).str.strip()
        df = df[df["review_text"].str.len() > 0]

        if "date" in df.columns:
            df["date"] = df["date"].astype(str)
        else:
            df["date"] = ""

        if "rating" in df.columns:
            df["rating"] = df["rating"].astype(str)
        else:
            df["rating"] = ""

        if df.empty:
            raise ValueError("No valid review rows remained after cleaning empty text.")

        return df[["product_id", "review_text", "date", "rating"]].to_dict(orient="records")

    @staticmethod
    def group_by_product(records: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Groups full review records by product ID."""
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for record in records:
            pid = record["product_id"]
            grouped.setdefault(pid, []).append(record)
        return grouped


data_service = DataService()
