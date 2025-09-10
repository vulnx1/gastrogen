import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HealthData } from "./HealthQuestionnaire";
import { Recipe, WearableData } from "../App";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { 
  Heart, 
  Target, 
  Zap, 
  TrendingUp, 
  Activity, 
  Moon, 
  Footprints, 
  Flame,
  ChefHat,
  Download,
  Bell,
  Plus
} from "lucide-react";

interface HealthDashboardProps {
  healthData: HealthData;
  userName: string;
  wearableData: WearableData;
  favoriteRecipes: Recipe[];
  onNavigateToRecipes: () => void;
}

export function HealthDashboard({ 
  healthData, 
  userName, 
  wearableData, 
  favoriteRecipes,
  onNavigateToRecipes 
}: HealthDashboardProps) {
  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);
  
  // Calculate daily calorie needs based on BMR and activity level
  const calculateCalorieNeeds = () => {
    if (!healthData.age || !healthData.weight.value || !healthData.height.value) return 2000;
    
    // Convert to metric if needed
    const weightKg = healthData.weight.unit === 'lbs' ? healthData.weight.value * 0.453592 : healthData.weight.value;
    const heightCm = healthData.height.unit === 'ft' ? healthData.height.value * 30.48 : healthData.height.value;
    
    // Simplified BMR calculation (assuming male for demo)
    const bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * healthData.age);
    return Math.round(bmr * 1.55); // Moderate activity level
  };

  const calorieNeeds = calculateCalorieNeeds();
  const calorieProgress = (wearableData.calories / calorieNeeds) * 100;

  // Mock weight progress data
  const weightProgressData = [
    { date: 'Week 1', weight: healthData.weight.value },
    { date: 'Week 2', weight: healthData.weight.value - 0.5 },
    { date: 'Week 3', weight: healthData.weight.value - 1.2 },
    { date: 'Week 4', weight: healthData.weight.value - 1.8 },
  ];

  // BMI progress data
  const bmiData = [
    { name: 'Current', value: healthData.bmi || 0, color: '#3B82F6' },
    { name: 'Target', value: 22, color: '#10B981' },
  ];

  // Activity data
  const activityData = [
    { name: 'Mon', steps: 8200, calories: 2100 },
    { name: 'Tue', steps: 9500, calories: 2250 },
    { name: 'Wed', steps: 7800, calories: 2050 },
    { name: 'Thu', steps: 10200, calories: 2400 },
    { name: 'Fri', steps: 8900, calories: 2180 },
    { name: 'Sat', steps: 12000, calories: 2600 },
    { name: 'Sun', steps: wearableData.steps, calories: wearableData.calories },
  ];

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600 dark:text-blue-400';
    if (bmi < 25) return 'text-green-600 dark:text-green-400';
    if (bmi < 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const wearableStats = [
    { 
      icon: Footprints, 
      label: 'Steps', 
      value: wearableData.steps.toLocaleString(), 
      goal: '10,000',
      progress: (wearableData.steps / 10000) * 100,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      icon: Heart, 
      label: 'Heart Rate', 
      value: `${wearableData.heartRate} bpm`, 
      goal: '60-100',
      progress: 75,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    { 
      icon: Moon, 
      label: 'Sleep', 
      value: `${wearableData.sleep}h`, 
      goal: '8h',
      progress: (wearableData.sleep / 8) * 100,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    { 
      icon: Flame, 
      label: 'Calories', 
      value: wearableData.calories.toLocaleString(), 
      goal: calorieNeeds.toLocaleString(),
      progress: calorieProgress,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
  ];

  return (
    <div className="min-h-screen pb-20 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
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
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Good morning, {firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Let's check your wellness journey today
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {wearableStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs bg-white/50 dark:bg-black/50">
                      {stat.goal}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {stat.value}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                        <span className="text-gray-500 dark:text-gray-500">
                          {Math.round(stat.progress)}%
                        </span>
                      </div>
                      <Progress value={stat.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* BMI & Weight Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Weight Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BMI Card */}
                  <div className="text-center">
                    <div className="mb-4">
                      <div className={`text-4xl font-bold mb-2 ${getBMIColor(healthData.bmi || 0)}`}>
                        {healthData.bmi}
                      </div>
                      <Badge className={`${
                        (healthData.bmi || 0) < 18.5 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        (healthData.bmi || 0) < 25 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        (healthData.bmi || 0) < 30 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {healthData.bmiCategory}
                      </Badge>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bmiData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            dataKey="value"
                          >
                            {bmiData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Weight Chart */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                      4-Week Trend
                    </h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightProgressData}>
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Calories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span>Daily Calories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {wearableData.calories}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Goal: {calorieNeeds} kcal
                  </div>
                  <Progress value={calorieProgress} className="mt-4 h-3" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {Math.max(0, calorieNeeds - wearableData.calories)} kcal
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Burned</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {Math.round(wearableData.steps * 0.04)} kcal
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Weekly Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="steps" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Recent Recipes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteRecipes.length > 0 ? (
                <div className="space-y-3">
                  {favoriteRecipes.slice(0, 3).map((recipe, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-black/30">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                        <ChefHat className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {recipe.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {recipe.calories} kcal • {recipe.cookTime} min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No favorite recipes yet
                  </p>
                  <Button
                    onClick={onNavigateToRecipes}
                    className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Find Recipes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Health Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Great Progress!
                    </span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    You're 85% towards your daily step goal. Keep it up!
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Heart Health
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your resting heart rate is excellent for your age group.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}