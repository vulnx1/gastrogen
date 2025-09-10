import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { HealthData } from "./HealthQuestionnaire";
import { Recipe, WearableData } from "../App";
import { 
  User, 
  Settings, 
  Download, 
  Share, 
  Bell, 
  Shield, 
  Heart,
  ChefHat,
  Clock,
  Trophy,
  Target,
  Calendar,
  Edit3,
  Camera,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

interface ProfileProps {
  userName: string;
  healthData: HealthData;
  favoriteRecipes: Recipe[];
  recipeHistory: Recipe[];
  wearableData: WearableData;
  onUpdateHealthData: (data: HealthData) => void;
}

export function Profile({ 
  userName, 
  healthData, 
  favoriteRecipes, 
  recipeHistory, 
  wearableData,
  onUpdateHealthData 
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(healthData);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    challengeUpdates: true,
    recipeRecommendations: true,
    healthAlerts: true
  });
  const [privacy, setPrivacy] = useState({
    shareProgress: true,
    showInLeaderboard: true,
    allowCommunityMessages: true
  });
  const [showPassword, setShowPassword] = useState(false);

  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);
  
  const handleSaveProfile = () => {
    onUpdateHealthData(editedData);
    setIsEditing(false);
  };

  const handleExportData = () => {
    // Mock PDF export functionality
    const reportData = {
      user: userName,
      healthData,
      wearableData,
      favoriteRecipes: favoriteRecipes.length,
      totalRecipes: recipeHistory.length,
      generatedAt: new Date().toISOString()
    };
    
    console.log('Exporting health report:', reportData);
    // In a real app, this would generate and download a PDF
  };

  const stats = [
    {
      label: 'Favorite Recipes',
      value: favoriteRecipes.length,
      icon: Heart,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Recipes Tried',
      value: recipeHistory.length,
      icon: ChefHat,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Days Active',
      value: 45,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Health Score',
      value: 85,
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const recentActivity = [
    { type: 'recipe', action: 'Favorited "Grilled Salmon Bowl"', time: '2 hours ago' },
    { type: 'challenge', action: 'Completed "10K Steps Daily"', time: '1 day ago' },
    { type: 'badge', action: 'Earned "Recipe Master" badge', time: '3 days ago' },
    { type: 'recipe', action: 'Created "Quinoa Power Bowl"', time: '5 days ago' },
    { type: 'health', action: 'Updated health goals', time: '1 week ago' }
  ];

  return (
    <div className="min-h-screen pb-24 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" alt={firstName} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-white/20 backdrop-blur-sm border-white/30"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            {firstName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Health & Wellness Enthusiast
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              size="sm"
              className="rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              size="sm"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
              <CardContent className="p-4">
                <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center bg-white/30 dark:bg-black/30`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span>Health Information</span>
                  </CardTitle>
                  <Button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    size="sm"
                    variant="outline"
                    className="rounded-xl bg-white/30 dark:bg-black/30"
                  >
                    {isEditing ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedData.age || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className="h-10 rounded-xl bg-white/50 dark:bg-black/50"
                      />
                    ) : (
                      <div className="h-10 px-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
                        {healthData.age} years
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height
                    </label>
                    <div className="h-10 px-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
                      {healthData.height.value} {healthData.height.unit}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Weight
                    </label>
                    <div className="h-10 px-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
                      {healthData.weight.value} {healthData.weight.unit}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Weight
                    </label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedData.targetWeight.value || ''}
                        onChange={(e) => setEditedData(prev => ({ 
                          ...prev, 
                          targetWeight: { ...prev.targetWeight, value: parseFloat(e.target.value) || 0 }
                        }))}
                        className="h-10 rounded-xl bg-white/50 dark:bg-black/50"
                      />
                    ) : (
                      <div className="h-10 px-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
                        {healthData.targetWeight.value} {healthData.targetWeight.unit}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    BMI Status
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                </div>

                {healthData.foodAllergies.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Food Allergies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {healthData.foodAllergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {healthData.healthConditions.length > 0 && healthData.healthConditions[0] !== 'None' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Health Conditions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {healthData.healthConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-100/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      value={userName}
                      disabled
                      className="flex-1 h-10 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                    />
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value="••••••••••"
                        disabled
                        className="h-10 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl">
                      <Lock className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Notification Settings */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Privacy</span>
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-white/30 dark:bg-black/30">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'recipe' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                        activity.type === 'challenge' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'badge' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-purple-100 dark:bg-purple-900/20'
                      }`}>
                        {activity.type === 'recipe' && <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        {activity.type === 'challenge' && <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'badge' && <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                        {activity.type === 'health' && <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start rounded-xl bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 text-gray-800 dark:text-gray-200">
                    <Download className="w-4 h-4 mr-2" />
                    Export Health Report
                  </Button>
                  <Button className="w-full justify-start rounded-xl bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 text-gray-800 dark:text-gray-200">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Connect Wearable
                  </Button>
                  <Button className="w-full justify-start rounded-xl bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 text-gray-800 dark:text-gray-200">
                    <Share className="w-4 h-4 mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}