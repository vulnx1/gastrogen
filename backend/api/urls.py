# api/urls.py
from django.urls import path, include
from .views import chat, generate_recipe, generate_recipe_from_image
from rest_framework.routers import DefaultRouter
from .views import (
    RecipeViewSet, FavoriteViewSet, RecipeHistoryViewSet,
    UserProfileViewSet, HealthDataViewSet, WearableDataViewSet,
)

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'history', RecipeHistoryViewSet, basename='history')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'health', HealthDataViewSet, basename='health')
router.register(r'wearable', WearableDataViewSet, basename='wearable')

urlpatterns = [
    path('', include(router.urls)),
    path("chat/", chat, name="chat"),
    path("generate_recipe/", generate_recipe, name="generate_recipe"),
    path("generate_recipe_from_image/", generate_recipe_from_image, name="generate_recipe_from_image"),
]
