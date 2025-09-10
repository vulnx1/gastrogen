import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Recipe } from "../App";
import { 
  Camera, 
  Upload, 
  Scan, 
  Zap, 
  Apple, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  X,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface FoodRecognitionProps {
  userName: string;
  onAddToHistory: (recipe: Recipe) => void;
}

interface FoodItem {
  name: string;
  calories: number;
  confidence: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  alternatives: string[];
  healthScore: number;
}

export function FoodRecognition({ userName, onAddToHistory }: FoodRecognitionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [recognizedFood, setRecognizedFood] = useState<FoodItem | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock food recognition data
  const mockFoodData: FoodItem[] = [
    {
      name: "Grilled Chicken Breast",
      calories: 231,
      confidence: 94,
      nutrition: { protein: 43.5, carbs: 0, fat: 5.1, fiber: 0 },
      alternatives: ["Grilled Turkey Breast", "Baked Cod", "Tofu Steak"],
      healthScore: 92
    },
    {
      name: "Caesar Salad",
      calories: 470,
      confidence: 87,
      nutrition: { protein: 12, carbs: 8, fat: 42, fiber: 4 },
      alternatives: ["Garden Salad with Vinaigrette", "Greek Salad", "Quinoa Bowl"],
      healthScore: 65
    },
    {
      name: "Chocolate Chip Cookie",
      calories: 150,
      confidence: 96,
      nutrition: { protein: 2, carbs: 20, fat: 7, fiber: 1 },
      alternatives: ["Oatmeal Cookie", "Apple Slices", "Dark Chocolate Square"],
      healthScore: 35
    },
    {
      name: "Avocado Toast",
      calories: 195,
      confidence: 91,
      nutrition: { protein: 6, carbs: 16, fat: 15, fiber: 10 },
      alternatives: ["Hummus Toast", "Peanut Butter Toast", "Greek Yogurt Bowl"],
      healthScore: 85
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCapturedImage(imageUrl);
        simulateFoodRecognition();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateFoodRecognition = async () => {
    setIsScanning(true);
    setRecognizedFood(null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

    // Randomly select a food item
    const randomFood = mockFoodData[Math.floor(Math.random() * mockFoodData.length)];
    setRecognizedFood(randomFood);
    setIsScanning(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
      
      simulateFoodRecognition();
    }
  };

  const resetScan = () => {
    setRecognizedFood(null);
    setCapturedImage(null);
    setIsScanning(false);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="min-h-screen pb-24 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent mb-2">
            Food Recognition
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Snap a photo to get instant nutrition info and healthier alternatives
          </p>
        </motion.div>

        {!capturedImage ? (
          /* Camera/Upload Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Camera Preview */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-white/50 rounded-2xl flex items-center justify-center">
                      <Scan className="w-8 h-8 text-white/70" />
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white text-sm text-center">
                        Position your food within the frame for best results
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl cursor-pointer hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
                onClick={startCamera}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Start Camera
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use your device camera
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl cursor-pointer hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Upload Photo
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose from gallery
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    AI Powered
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instant nutrition analysis
                  </p>
                </CardContent>
              </Card>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {videoRef.current?.srcObject && (
              <div className="text-center">
                <Button
                  onClick={capturePhoto}
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-2xl px-8 py-3"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Photo
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Results Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Captured Image */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured food" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scanning State */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Scan className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Analyzing Your Food
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        AI is processing nutrition information...
                      </p>
                      <div className="w-full max-w-xs mx-auto">
                        <Progress value={75} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recognition Results */}
            <AnimatePresence>
              {recognizedFood && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Main Food Info */}
                  <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <span>{recognizedFood.name}</span>
                        </CardTitle>
                        <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                          {recognizedFood.confidence}% confident
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 rounded-xl bg-white/30 dark:bg-black/30">
                          <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {recognizedFood.calories}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Calories
                          </div>
                        </div>
                        
                        <div className="text-center p-4 rounded-xl bg-white/30 dark:bg-black/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {recognizedFood.nutrition.protein}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Protein
                          </div>
                        </div>
                        
                        <div className="text-center p-4 rounded-xl bg-white/30 dark:bg-black/30">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {recognizedFood.nutrition.carbs}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Carbs
                          </div>
                        </div>
                        
                        <div className="text-center p-4 rounded-xl bg-white/30 dark:bg-black/30">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {recognizedFood.nutrition.fat}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Fat
                          </div>
                        </div>
                      </div>

                      {/* Health Score */}
                      <div className={`p-4 rounded-xl ${getHealthScoreBg(recognizedFood.healthScore)} border border-white/20`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Health Score
                          </span>
                          <span className={`text-2xl font-bold ${getHealthScoreColor(recognizedFood.healthScore)}`}>
                            {recognizedFood.healthScore}/100
                          </span>
                        </div>
                        <Progress 
                          value={recognizedFood.healthScore} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {recognizedFood.healthScore >= 80 ? 'Excellent choice! Very nutritious.' :
                           recognizedFood.healthScore >= 60 ? 'Good choice with some nutritional benefits.' :
                           'Consider healthier alternatives when possible.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Healthier Alternatives */}
                  <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Healthier Alternatives</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recognizedFood.alternatives.map((alternative, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                  {alternative}
                                </div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                  Better nutrition profile
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl border-2 border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-black/50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Scan Another
                    </Button>
                    <Button
                      onClick={() => {
                        // Mock adding to history
                        const mockRecipe: Recipe = {
                          id: Date.now().toString(),
                          title: recognizedFood.name,
                          image: capturedImage,
                          cookTime: 0,
                          servings: 1,
                          difficulty: 'Easy',
                          calories: recognizedFood.calories,
                          cost: 0,
                          ingredients: [],
                          instructions: [`Nutrition info for ${recognizedFood.name}`],
                          nutrition: {
                            protein: recognizedFood.nutrition.protein,
                            carbs: recognizedFood.nutrition.carbs,
                            fat: recognizedFood.nutrition.fat,
                            fiber: recognizedFood.nutrition.fiber,
                            sugar: 0,
                            sodium: 0
                          },
                          tags: ['scanned']
                        };
                        onAddToHistory(mockRecipe);
                        resetScan();
                      }}
                      className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save to History
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}