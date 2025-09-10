import { useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { BottomNavigation } from "./components/BottomNavigation";
import { LoginPage } from "./components/LoginPage";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HealthQuestionnaire, HealthData } from "./components/HealthQuestionnaire";
import { HealthDashboard } from "./components/HealthDashboard";
import { RecipeGenerator } from "./components/RecipeGenerator";
import { AIHealthCoach } from "./components/AIHealthCoach";
import { FoodRecognition } from "./components/FoodRecognition";
import { RecipeBuilder } from "./components/RecipeBuilder";
import { Community } from "./components/Community";
import { Profile } from "./components/Profile";
import { EmergencyAlerts } from "./components/EmergencyAlerts";

type AppState = 'login' | 'welcome' | 'questionnaire' | 'dashboard' | 'recipes' | 'coach' | 'food-recognition' | 'recipe-builder' | 'community' | 'profile';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  cost: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  tags: string[];
  isFavorite?: boolean;
}

export interface WearableData {
  steps: number;
  heartRate: number;
  sleep: number;
  calories: number;
  distance: number;
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [userName, setUserName] = useState('');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recipeHistory, setRecipeHistory] = useState<Recipe[]>([]);
  const [wearableData, setWearableData] = useState<WearableData>({
    steps: 8542,
    heartRate: 72,
    sleep: 7.5,
    calories: 2150,
    distance: 6.2
  });

  const handleLogin = (email: string) => {
    setUserName(email);
    setCurrentState('welcome');
  };

  const handleStartHealthCheck = () => {
    setCurrentState('questionnaire');
  };

  const handleQuestionnaireComplete = (data: HealthData) => {
    setHealthData(data);
    setCurrentState('dashboard');
  };

  const toggleFavoriteRecipe = (recipe: Recipe) => {
    const isFavorite = favoriteRecipes.some(fav => fav.id === recipe.id);
    if (isFavorite) {
      setFavoriteRecipes(prev => prev.filter(fav => fav.id !== recipe.id));
    } else {
      setFavoriteRecipes(prev => [...prev, { ...recipe, isFavorite: true }]);
    }
  };

  const addToHistory = (recipe: Recipe) => {
    setRecipeHistory(prev => {
      const existing = prev.find(r => r.id === recipe.id);
      if (existing) return prev;
      return [recipe, ...prev].slice(0, 20); // Keep only last 20
    });
  };

  const showEmergencyAlert = healthData && (
    (healthData.bmi && (healthData.bmi < 16 || healthData.bmi > 35)) ||
    healthData.healthConditions.some(condition => 
      ['Heart Disease', 'Diabetes', 'High Blood Pressure'].includes(condition)
    )
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950 dark:via-cyan-950 dark:to-blue-950 transition-colors duration-500">
        <ThemeToggle />
        
        {showEmergencyAlert && (
          <EmergencyAlerts 
            healthData={healthData!}
            onDismiss={() => {}}
          />
        )}
        
        {currentState === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {currentState === 'welcome' && (
          <WelcomeScreen 
            userName={userName} 
            onStartHealthCheck={handleStartHealthCheck} 
          />
        )}
        
        {currentState === 'questionnaire' && (
          <HealthQuestionnaire onComplete={handleQuestionnaireComplete} />
        )}
        
        {currentState === 'dashboard' && healthData && (
          <HealthDashboard 
            healthData={healthData}
            userName={userName}
            wearableData={wearableData}
            favoriteRecipes={favoriteRecipes}
            onNavigateToRecipes={() => setCurrentState('recipes')}
          />
        )}
        
        {currentState === 'recipes' && healthData && (
          <RecipeGenerator 
            healthData={healthData}
            userName={userName}
            favoriteRecipes={favoriteRecipes}
            recipeHistory={recipeHistory}
            onToggleFavorite={toggleFavoriteRecipe}
            onAddToHistory={addToHistory}
          />
        )}
        
        {currentState === 'coach' && healthData && (
          <AIHealthCoach 
            healthData={healthData}
            userName={userName}
            wearableData={wearableData}
          />
        )}
        
        {currentState === 'food-recognition' && (
          <FoodRecognition 
            userName={userName}
            onAddToHistory={addToHistory}
          />
        )}
        
        {currentState === 'recipe-builder' && (
          <RecipeBuilder 
            userName={userName}
            onSaveRecipe={(recipe) => {
              addToHistory(recipe);
              setCurrentState('recipes');
            }}
          />
        )}
        
        {currentState === 'community' && (
          <Community userName={userName} />
        )}
        
        {currentState === 'profile' && healthData && (
          <Profile 
            userName={userName}
            healthData={healthData}
            favoriteRecipes={favoriteRecipes}
            recipeHistory={recipeHistory}
            wearableData={wearableData}
            onUpdateHealthData={setHealthData}
          />
        )}
        
        {/* Bottom Navigation - only show after login */}
        {currentState !== 'login' && currentState !== 'welcome' && currentState !== 'questionnaire' && (
          <BottomNavigation 
            currentState={currentState}
            onNavigate={setCurrentState}
          />
        )}
      </div>
    </ThemeProvider>
  );
}