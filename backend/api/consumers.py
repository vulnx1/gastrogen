import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .rag_service import query_rag

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        user_msg = data["message"]

        # Call RAG to get AI reply
        reply = query_rag(user_msg)

        await self.send(text_data=json.dumps({
            "sender": "ai",
            "text": reply
        }))
