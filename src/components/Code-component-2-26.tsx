import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Recipe } from "../App";
import { 
  Puzzle, 
  Plus, 
  X, 
  ChefHat, 
  Clock, 
  Users, 
  Zap,
  GripVertical,
  Save,
  Wand2,
  Camera,
  Mic
} from "lucide-react";

interface RecipeBuilderProps {
  userName: string;
  onSaveRecipe: (recipe: Recipe) => void;
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  calories: number;
}

interface Instruction {
  id: string;
  step: number;
  text: string;
  time?: number;
}

export function RecipeBuilder({ userName, onSaveRecipe }: RecipeBuilderProps) {
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [draggedIngredient, setDraggedIngredient] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableIngredients = [
    { name: 'Chicken Breast', calories: 165, unit: 'g' },
    { name: 'Salmon Fillet', calories: 206, unit: 'g' },
    { name: 'Brown Rice', calories: 111, unit: 'g' },
    { name: 'Quinoa', calories: 120, unit: 'g' },
    { name: 'Broccoli', calories: 34, unit: 'g' },
    { name: 'Sweet Potato', calories: 86, unit: 'g' },
    { name: 'Avocado', calories: 160, unit: 'piece' },
    { name: 'Olive Oil', calories: 884, unit: 'ml' },
    { name: 'Eggs', calories: 70, unit: 'piece' },
    { name: 'Greek Yogurt', calories: 59, unit: 'g' },
    { name: 'Spinach', calories: 23, unit: 'g' },
    { name: 'Tomatoes', calories: 18, unit: 'g' },
    { name: 'Bell Peppers', calories: 31, unit: 'g' },
    { name: 'Onions', calories: 40, unit: 'g' },
    { name: 'Garlic', calories: 149, unit: 'g' },
    { name: 'Lemon', calories: 17, unit: 'piece' },
  ];

  const addIngredient = (ingredientData: typeof availableIngredients[0]) => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredientData.name,
      amount: '100',
      unit: ingredientData.unit,
      calories: ingredientData.calories
    };
    setIngredients(prev => [...prev, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const addInstruction = () => {
    const newInstruction: Instruction = {
      id: Date.now().toString(),
      step: instructions.length + 1,
      text: '',
      time: undefined
    };
    setInstructions(prev => [...prev, newInstruction]);
  };

  const removeInstruction = (id: string) => {
    setInstructions(prev => {
      const filtered = prev.filter(inst => inst.id !== id);
      return filtered.map((inst, index) => ({ ...inst, step: index + 1 }));
    });
  };

  const updateInstruction = (id: string, field: keyof Instruction, value: string | number) => {
    setInstructions(prev => prev.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const calculateTotalCalories = () => {
    return ingredients.reduce((total, ing) => {
      const amount = parseFloat(ing.amount) || 0;
      const caloriesPer100g = ing.calories;
      if (ing.unit === 'piece') {
        return total + (caloriesPer100g * amount);
      }
      return total + (caloriesPer100g * amount / 100);
    }, 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRecipeImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim()) return;

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: recipeName,
      image: recipeImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
      cookTime: parseInt(cookTime) || 30,
      servings: parseInt(servings) || 4,
      difficulty,
      calories: Math.round(calculateTotalCalories()),
      cost: Math.round(ingredients.length * 2.5), // Mock cost calculation
      ingredients: ingredients.map(ing => `${ing.amount}${ing.unit} ${ing.name}`),
      instructions: instructions.map(inst => inst.text),
      nutrition: {
        protein: Math.round(calculateTotalCalories() * 0.2 / 4), // Mock nutrition
        carbs: Math.round(calculateTotalCalories() * 0.5 / 4),
        fat: Math.round(calculateTotalCalories() * 0.3 / 9),
        fiber: Math.round(ingredients.length * 2),
        sugar: Math.round(calculateTotalCalories() * 0.1 / 4),
        sodium: Math.round(ingredients.length * 50)
      },
      tags: [...tags, 'custom']
    };

    onSaveRecipe(recipe);
  };

  const handleDragStart = (e: React.DragEvent, ingredientName: string) => {
    setDraggedIngredient(ingredientName);
    e.dataTransfer.setData('text/plain', ingredientName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ingredientName = e.dataTransfer.getData('text/plain');
    const ingredient = availableIngredients.find(ing => ing.name === ingredientName);
    if (ingredient && !ingredients.some(ing => ing.name === ingredient.name)) {
      addIngredient(ingredient);
    }
    setDraggedIngredient(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen pb-24 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Puzzle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            Recipe Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop ingredients to create your perfect recipe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ingredient Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ingredient Library</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag ingredients to your recipe
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {availableIngredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * index }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ingredient.name)}
                      className={`p-3 rounded-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 cursor-grab active:cursor-grabbing hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300 ${
                        ingredients.some(ing => ing.name === ingredient.name) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {ingredient.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {ingredient.calories} cal/{ingredient.unit}
                            </div>
                          </div>
                        </div>
                        {!ingredients.some(ing => ing.name === ingredient.name) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addIngredient(ingredient)}
                            className="h-8 w-8 p-0 rounded-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recipe Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Basic Info */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipe Name
                    </label>
                    <Input
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Enter recipe name"
                      className="h-12 rounded-xl bg-white/50 dark:bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipe Image
                    </label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl bg-white/50 dark:bg-black/50"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {recipeImage && (
                  <div className="relative">
                    <img 
                      src={recipeImage} 
                      alt="Recipe" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <Button
                      onClick={() => setRecipeImage(null)}
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your recipe..."
                    className="h-20 rounded-xl bg-white/50 dark:bg-black/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cook Time (minutes)
                    </label>
                    <Input
                      type="number"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      placeholder="30"
                      className="h-12 rounded-xl bg-white/50 dark:bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Servings
                    </label>
                    <Input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      placeholder="4"
                      className="h-12 rounded-xl bg-white/50 dark:bg-black/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                      <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-black/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ingredients</span>
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                    {Math.round(calculateTotalCalories())} total calories
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drop ingredients here or adjust amounts
                </p>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`min-h-32 p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                    draggedIngredient 
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/20'
                  }`}
                >
                  <AnimatePresence>
                    {ingredients.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Drag ingredients here to start building your recipe
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {ingredients.map((ingredient, index) => (
                          <motion.div
                            key={ingredient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-black/30"
                          >
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <Input
                                value={ingredient.amount}
                                onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                                placeholder="Amount"
                                className="h-10 rounded-lg bg-white/50 dark:bg-black/50"
                              />
                              <Input
                                value={ingredient.unit}
                                onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                                placeholder="Unit"
                                className="h-10 rounded-lg bg-white/50 dark:bg-black/50"
                              />
                              <div className="flex items-center">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {ingredient.name}
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeIngredient(ingredient.id)}
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Instructions</span>
                  <Button
                    onClick={addInstruction}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {instructions.map((instruction, index) => (
                      <motion.div
                        key={instruction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 rounded-xl bg-white/30 dark:bg-black/30"
                      >
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-medium text-sm">
                          {instruction.step}
                        </div>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            value={instruction.text}
                            onChange={(e) => updateInstruction(instruction.id, 'text', e.target.value)}
                            placeholder="Describe this step..."
                            className="h-20 rounded-lg bg-white/50 dark:bg-black/50"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <Input
                                type="number"
                                value={instruction.time || ''}
                                onChange={(e) => updateInstruction(instruction.id, 'time', parseInt(e.target.value) || 0)}
                                placeholder="Time (min)"
                                className="h-8 w-24 rounded-lg bg-white/50 dark:bg-black/50"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <Mic className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeInstruction(instruction.id)}
                          size="icon"
                          variant="outline"
                          className="h-10 w-10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {instructions.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No instructions yet
                      </p>
                      <Button
                        onClick={addInstruction}
                        variant="outline"
                        className="bg-white/50 dark:bg-black/50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Step
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/50 dark:bg-black/50 flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <Button
                        onClick={() => removeTag(tag)}
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add a tag..."
                    className="h-10 rounded-lg bg-white/50 dark:bg-black/50"
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    className="h-10 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex space-x-4">
              <Button
                onClick={handleSaveRecipe}
                disabled={!recipeName.trim() || ingredients.length === 0 || instructions.length === 0}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Recipe
              </Button>
              <Button
                variant="outline"
                className="h-14 px-6 rounded-2xl border-2 border-emerald-300/50 dark:border-emerald-700/50 bg-white/50 dark:bg-black/50"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                AI Assist
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}