import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HealthData } from "./HealthQuestionnaire";
import { Recipe } from "../App";
import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, Camera, Upload, ChefHat, Heart, Clock, Users, 
  Sparkles, ArrowLeft, Wand2, Brain, Image as ImageIcon,
  Type, Utensils, Leaf, Zap, Star, BookOpen
} from "lucide-react";

interface RecipeGeneratorProps {
  healthData: HealthData;
  userName: string;
  favoriteRecipes: Recipe[];
  recipeHistory: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToHistory: (recipe: Recipe) => void;
}

export function RecipeGenerator({ 
  healthData, 
  userName, 
  favoriteRecipes, 
  recipeHistory, 
  onToggleFavorite, 
  onAddToHistory 
}: RecipeGeneratorProps) {
  const [inputMethod, setInputMethod] = useState<'voice' | 'text' | 'image' | 'ingredients' | 'dietary' | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);

  const commonIngredients = [
    'Chicken', 'Beef', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Quinoa', 'Beans',
    'Lentils', 'Spinach', 'Broccoli', 'Carrots', 'Tomatoes', 'Onions',
    'Garlic', 'Ginger', 'Olive Oil', 'Coconut Oil', 'Avocado', 'Sweet Potato'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Low-Carb', 'High-Protein', 'Mediterranean',
    'Paleo', 'Gluten-Free', 'Dairy-Free', 'Low-Sodium'
  ];

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setTextInput("I want a healthy dinner recipe with chicken and vegetables");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload image to backend and generate via Ollama vision
    const run = async () => {
      try {
        setIsGenerating(true);
        const form = new FormData();
        form.append('image', file);
        if (dietaryPreference) form.append('dietaryPreference', dietaryPreference);

        const res = await fetch('/api/generate_recipe_from_image/', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Backend error ${res.status}: ${text}`);
        }
        const data: Recipe = await res.json();
        setGeneratedRecipe(data);
        onAddToHistory && onAddToHistory(data);
      } catch (err) {
        console.error('Failed to generate recipe from image:', err);
        // Fallback message so user knows something happened
        setTextInput('Recipe based on uploaded image');
      } finally {
        setIsGenerating(false);
      }
    };

    run();
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        prompt: (inputMethod === 'text' || inputMethod === 'voice' || inputMethod === 'image') ? textInput : '',
        ingredients: inputMethod === 'ingredients' ? selectedIngredients : selectedIngredients,
        dietaryPreference: inputMethod === 'dietary' ? dietaryPreference : dietaryPreference,
        healthData,
      };

      const res = await fetch('/api/generate_recipe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error ${res.status}: ${text}`);
      }

      const data: Recipe = await res.json();
      setGeneratedRecipe(data);
      onAddToHistory && onAddToHistory(data);
    } catch (err) {
      console.error('Failed to generate recipe:', err);
      // Fallback: keep previous behavior if backend fails
      const mockRecipe: Recipe = {
        id: Date.now().toString(),
        title: getRecipeName(),
        image: "https://images.unsplash.com/photo-1646834118758-479021c8d1fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGluZ3JlZGllbnRzJTIwY29va2luZ3xlbnwxfHx8fDE3NTc0MDk4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        cookTime: 30,
        servings: 4,
        difficulty: 'Easy',
        calories: getNutritionalCalories(),
        cost: 15,
        ingredients: getRecipeIngredients(),
        instructions: getRecipeInstructions(),
        nutrition: { protein: 25, carbs: 35, fat: 12, fiber: 6, sugar: 5, sodium: 300 },
        tags: [dietaryPreference || 'Balanced']
      };
      setGeneratedRecipe(mockRecipe);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRecipeName = () => {
    if (dietaryPreference.includes('Vegan')) return "Quinoa Buddha Bowl";
    if (dietaryPreference.includes('Keto')) return "Keto Salmon with Avocado";
    if (selectedIngredients.includes('Chicken')) return "Herb-Crusted Chicken Breast";
    return "Mediterranean Wellness Bowl";
  };

  const getRecipeIngredients = () => {
    const baseIngredients = ['2 cups mixed greens', '1 cup quinoa', '1 avocado', '2 tbsp olive oil'];
    
    if (selectedIngredients.length > 0) {
      return [...baseIngredients, ...selectedIngredients.slice(0, 3).map(ing => `1 cup ${ing.toLowerCase()}`)];
    }
    
    return [
      '2 cups mixed greens', '1 cup cooked quinoa', '1 grilled chicken breast',
      '1 avocado, sliced', '1 cup cherry tomatoes', '1/2 cucumber, diced',
      '2 tbsp olive oil', '1 tbsp lemon juice', 'Salt and pepper to taste'
    ];
  };

  const getRecipeInstructions = () => {
    return [
      "Prepare all ingredients by washing and chopping vegetables.",
      "Cook quinoa according to package instructions and let cool.",
      "Season and cook protein of choice until fully cooked.",
      "Arrange greens in a large bowl as the base.",
      "Add quinoa, cooked protein, and chopped vegetables.",
      "Drizzle with olive oil and lemon juice.",
      "Season with salt and pepper, then serve immediately."
    ];
  };

  const getNutritionalCalories = () => {
    if (healthData.bmiCategory === 'Underweight') return 650;
    if (healthData.bmiCategory === 'Normal') return 450;
    return 350; // For overweight/obese
  };

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => [...prev, recipe]);
  };

  const resetGenerator = () => {
    setInputMethod(null);
    setTextInput("");
    setSelectedIngredients([]);
    setDietaryPreference("");
    setGeneratedRecipe(null);
  };

  const inputMethods = [
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Input',
      description: 'Tell us what you want to cook',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      bgGradient: 'from-purple-50 via-pink-50 to-red-50 dark:from-purple-950 dark:via-pink-950 dark:to-red-950'
    },
    {
      id: 'text',
      icon: Type,
      title: 'Text Input',
      description: 'Type your recipe request',
      gradient: 'from-emerald-500 via-cyan-500 to-blue-500',
      bgGradient: 'from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950 dark:via-cyan-950 dark:to-blue-950'
    },
    {
      id: 'image',
      icon: ImageIcon,
      title: 'Image Upload',
      description: 'Upload a photo of ingredients',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950'
    },
    {
      id: 'ingredients',
      icon: Utensils,
      title: 'Ingredient Selection',
      description: 'Choose from available ingredients',
      gradient: 'from-green-500 via-teal-500 to-emerald-500',
      bgGradient: 'from-green-50 via-teal-50 to-emerald-50 dark:from-green-950 dark:via-teal-950 dark:to-emerald-950'
    },
    {
      id: 'dietary',
      icon: Leaf,
      title: 'Dietary Preference',
      description: 'Select your dietary needs',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgGradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950'
    }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              animate={{
                x: [-100, 100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
            <ChefHat className="w-12 h-12 text-white relative z-10" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl mb-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              AI Recipe Generator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Welcome back, {firstName}!
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Choose how you'd like to create your next delicious meal
            </p>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!inputMethod && !generatedRecipe && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {inputMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <Card 
                    className={`cursor-pointer border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group-hover:shadow-3xl overflow-hidden relative`}
                    onClick={() => setInputMethod(method.id as any)}
                  >
                    {/* Background gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                    
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          animate={{
                            x: [-100, 100],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut"
                          }}
                        />
                        <method.icon className="w-10 h-10 text-white relative z-10" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {method.description}
                      </p>
                      
                      {/* Hover effect overlay */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Method Content */}
        {inputMethod && !generatedRecipe && (
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {inputMethod === 'voice' && "Voice Input"}
                  {inputMethod === 'text' && "Text Input"}
                  {inputMethod === 'image' && "Image Upload"}
                  {inputMethod === 'ingredients' && "Select Ingredients"}
                  {inputMethod === 'dietary' && "Dietary Preferences"}
                </span>
                <Button variant="outline" onClick={resetGenerator}>
                  Back
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {inputMethod === 'voice' && (
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleVoiceInput}
                    className={`w-24 h-24 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} hover:scale-105 transition-all`}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </Button>
                  <p className="text-gray-600">
                    {isRecording ? "Listening... Speak now!" : "Tap to start recording"}
                  </p>
                  {textInput && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700">Heard: "{textInput}"</p>
                    </div>
                  )}
                </div>
              )}

              {inputMethod === 'text' && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe what kind of recipe you want... (e.g., 'I want a healthy dinner recipe with chicken and vegetables for weight loss')"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-32 rounded-xl"
                  />
                </div>
              )}

              {inputMethod === 'image' && (
                <div className="text-center space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Button onClick={handleImageUpload} variant="outline" disabled={isGenerating}>
                      {isGenerating ? 'Processing Image...' : 'Choose Image'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a photo of ingredients or a dish you want to recreate
                    </p>
                  </div>
                  {textInput && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700">{textInput}</p>
                    </div>
                  )}
                </div>
              )}

              {inputMethod === 'ingredients' && (
                <div className="space-y-4">
                  <p className="text-gray-700">Select ingredients you have available:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {commonIngredients.map((ingredient) => (
                      <div key={ingredient} className="flex items-center space-x-2">
                        <Checkbox
                          id={ingredient}
                          checked={selectedIngredients.includes(ingredient)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIngredients(prev => [...prev, ingredient]);
                            } else {
                              setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
                            }
                          }}
                        />
                        <label htmlFor={ingredient} className="text-sm">{ingredient}</label>
                      </div>
                    ))}
                  </div>
                  {selectedIngredients.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected ingredients:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedIngredients.map((ingredient) => (
                          <Badge key={ingredient} variant="secondary" className="rounded-full">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {inputMethod === 'dietary' && (
                <div className="space-y-4">
                  <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select your dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {dietaryPreference && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        Great choice! We'll create a {dietaryPreference.toLowerCase()} recipe that fits your health profile.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={generateRecipe}
                disabled={
                  isGenerating ||
                  (!textInput && inputMethod === 'text') ||
                  (!textInput && inputMethod === 'voice') ||
                  (false && inputMethod === 'image') ||
                  (selectedIngredients.length === 0 && inputMethod === 'ingredients') ||
                  (!dietaryPreference && inputMethod === 'dietary')
                }
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isGenerating ? "Generating Recipe..." : "Generate Recipe"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generated Recipe */}
        {generatedRecipe && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-gray-800">{generatedRecipe.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => saveRecipe(generatedRecipe)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                  <Button onClick={resetGenerator} variant="outline">
                    New Recipe
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{generatedRecipe.cookTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{generatedRecipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-600">🔥</span>
                  <span>{generatedRecipe.calories} calories</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={generatedRecipe.image}
                  alt={generatedRecipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg mb-3 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Ingredients</span>
                  </h3>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg mb-3 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Nutrition</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xl">{generatedRecipe.calories}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-xl">{generatedRecipe.nutrition.protein} g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-xl">
                      <div className="text-xl">{generatedRecipe.nutrition.carbs} g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xl">{generatedRecipe.nutrition.fat} g</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-3 flex items-center space-x-2">
                  <span>👨‍🍳</span>
                  <span>Instructions</span>
                </h3>
                <ol className="space-y-3">
                  {generatedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-lg mb-3 flex items-center space-x-2">
                  <span>🏷️</span>
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedRecipe.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl mb-4 text-gray-800">Saved Recipes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes.map((recipe) => (
                <Card key={recipe.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="mb-2">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{recipe.cookTime} min</span>
                      <span>{recipe.calories} cal</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}