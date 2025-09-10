# api/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Recipe, Favorite, RecipeHistory, UserProfile, HealthData, WearableData
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .rag_service import query_rag, add_documents
from .serializers import (
    RecipeSerializer, FavoriteSerializer, RecipeHistorySerializer,
    UserProfileSerializer, HealthDataSerializer, WearableDataSerializer
)
from langchain_community.llms import Ollama
import json
import re
from django.views.decorators.csrf import csrf_exempt
import base64
import os
import requests

initial_docs = [
    "Walking 30 minutes daily improves cardiovascular health.",
    "Eating vegetables and fruits reduces the risk of chronic diseases.",
    "Good sleep (7-8 hours) improves focus and reduces stress."
]

# Load docs once at startup
add_documents(initial_docs)

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def chat(request):
    user_query = request.data.get("message")
    if not user_query:
        return Response({"error": "No message provided"}, status=400)

    response = query_rag(user_query)
    return Response({"reply": response})

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['difficulty']  # you can add calories range via custom FilterSet
    search_fields = ['title', 'tags']
    ordering_fields = ['created_at', 'calories']

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('recipe')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RecipeHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # latest 20 by default
        return RecipeHistory.objects.filter(user=self.request.user).select_related('recipe').order_by('-created_at')[:20]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HealthDataViewSet(viewsets.ModelViewSet):
    serializer_class = HealthDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HealthData.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WearableDataViewSet(viewsets.ModelViewSet):
    serializer_class = WearableDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WearableData.objects.filter(user=self.request.user).order_by('-recorded_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def generate_recipe_from_image(request):
    """Generate a recipe from an uploaded image using an Ollama vision model.

    Multipart form fields:
      - image: binary file
      - dietaryPreference (optional)
    """
    f = request.FILES.get("image")
    if not f:
        return Response({"error": "No image provided (field name 'image')"}, status=400)

    dietary = (request.POST.get("dietaryPreference") or "").strip()

    # Encode image as base64 as required by Ollama vision API
    image_bytes = f.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # Choose a local vision-capable model. Common options: 'llava', 'llama3.2-vision'
    vision_model = os.getenv("OLLAMA_VISION_MODEL", "llava")
    ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")

    prompt = (
        "You are a culinary vision assistant. Look at the image and infer the most likely dish "
        "or list of ingredients. Then produce a complete recipe as STRICT JSON only, following this schema: "
        '{"id":"string","title":"string","image":"string","cookTime":30,"servings":2,"difficulty":"Easy",'
        '"calories":450,"cost":10,"ingredients":["string"],"instructions":["string"],"nutrition":{"protein":25,"carbs":35,'
        '"fat":12,"fiber":6,"sugar":5,"sodium":300},"tags":["string"]}'. \
        "Do not include any text outside JSON. Use a representative Unsplash image URL for the image field."
    )

    payload = {
        "model": vision_model,
        "prompt": prompt,
        "images": [image_b64],
        "stream": False,
        "options": {"temperature": 0.2},
    }

    try:
        r = requests.post(f"{ollama_host}/api/generate", json=payload, timeout=120)
        if not r.ok:
            return Response({"error": f"Ollama vision request failed: {r.status_code} {r.text}"}, status=502)
        resp = r.json()
        raw = resp.get("response", "")
    except Exception as e:
        return Response({"error": f"Failed to call Ollama: {e}"}, status=502)

    # Reuse JSON parsing and coercion helpers
    def parse_json_strict(s: str):
        try:
            return json.loads(s)
        except Exception:
            match = re.search(r"\{[\s\S]*\}", s)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    return None
            return None

    def coerce_int(v, default=0):
        try:
            return int(round(float(v)))
        except Exception:
            return default

    data = parse_json_strict(raw) or {}

    recipe = {
        "id": str(data.get("id") or "local-vision-" + str(Recipe.objects.count() + 1)),
        "title": data.get("title") or "AI Image Recipe",
        "image": data.get("image") or "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&q=80&auto=format&fit=crop",
        "cookTime": coerce_int(data.get("cookTime"), 25),
        "servings": coerce_int(data.get("servings"), 2),
        "difficulty": data.get("difficulty") or "Easy",
        "calories": coerce_int(data.get("calories"), 420),
        "cost": coerce_int(data.get("cost"), 12),
        "ingredients": data.get("ingredients") or [],
        "instructions": data.get("instructions") or [],
        "nutrition": {
            "protein": coerce_int((data.get("nutrition") or {}).get("protein"), 20),
            "carbs": coerce_int((data.get("nutrition") or {}).get("carbs"), 40),
            "fat": coerce_int((data.get("nutrition") or {}).get("fat"), 10),
            "fiber": coerce_int((data.get("nutrition") or {}).get("fiber"), 5),
            "sugar": coerce_int((data.get("nutrition") or {}).get("sugar"), 6),
            "sodium": coerce_int((data.get("nutrition") or {}).get("sodium"), 320),
        },
        "tags": data.get("tags") or ([dietary] if dietary else ["Image-based"]),
    }

    return Response(recipe)