# api/serializers.py
from rest_framework import serializers
from .models import Recipe, Favorite, RecipeHistory, UserProfile, HealthData, WearableData

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ("user",)

class RecipeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeHistory
        fields = "__all__"
        read_only_fields = ("user",)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ("user",)

class HealthDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthData
        fields = "__all__"
        read_only_fields = ("user",)

class WearableDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WearableData
        fields = "__all__"
        read_only_fields = ("user",)