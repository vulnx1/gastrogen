from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator

User = settings.AUTH_USER_MODEL

class Recipe(models.Model):
    DIFFICULTY_CHOICES = (('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard'))

    title = models.CharField(max_length=200)
    image = models.URLField(blank=True)  # store URL; can switch to ImageField if serving media
    cook_time = models.PositiveIntegerField(default=0)  # minutes
    servings = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Easy')
    calories = models.IntegerField(null=True, blank=True)
    cost = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    # Store arrays as JSON to align with frontend structures
    ingredients = models.JSONField(default=list, blank=True)
    instructions = models.JSONField(default=list, blank=True)
    nutrition = models.JSONField(default=dict, blank=True)
    tags = models.JSONField(default=list, blank=True)  # e.g., ['low-carb','vegan']
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

class RecipeHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipe_history')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    notification_prefs = models.JSONField(default=dict, blank=True)
    privacy_settings = models.JSONField(default=dict, blank=True)

class HealthData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='health_data')
    age = models.PositiveIntegerField(null=True, blank=True)
    height = models.JSONField(default=dict, blank=True)       # { value, unit }
    weight = models.JSONField(default=dict, blank=True)       # { value, unit }
    target_weight = models.JSONField(default=dict, blank=True)# { value, unit }
    bmi = models.FloatField(null=True, blank=True)
    bmi_category = models.CharField(max_length=50, blank=True)
    food_allergies = models.JSONField(default=list, blank=True)
    health_conditions = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class WearableData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wearable_data')
    steps = models.IntegerField(default=0)
    heart_rate = models.IntegerField(default=0)
    sleep = models.FloatField(default=0.0)     # hours
    calories = models.IntegerField(default=0)
    distance = models.FloatField(default=0.0)  # km
    recorded_at = models.DateTimeField(auto_now_add=True)