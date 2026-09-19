import google.generativeai as genai
from backend.core.config import settings

# Configure Gemini with the API key from settings
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
class AgentService:
    def __init__(self):
        # We use the recommended pro model for text reasoning
        self.model = genai.GenerativeModel('gemini-pro')
        
    def chat_with_context(self, context_text: str, user_question: str) -> str:
        """
        Sends context (like a set of reviews) and a user question to Gemini.
        """
        if not settings.GEMINI_API_KEY:
            return "Error: GEMINI_API_KEY is not configured in the environment."
            
        prompt = f"""
        You are a Customer Insights Analyst. 
        Read the following customer reviews carefully:
        
        <REVIEWS>
        {context_text}
        </REVIEWS>
        
        Based ONLY on the reviews provided above, please answer the user's question.
        If the answer is not in the reviews, say you don't know based on the provided context.
        
        User Question: {user_question}
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"An error occurred while communicating with the AI Agent: {str(e)}"
            
agent_service = AgentService()
