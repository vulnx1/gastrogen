import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { User, Scale, Target, AlertTriangle, Heart, ChevronRight, ChevronLeft } from "lucide-react";

export interface HealthData {
  age: number;
  height: { value: number; unit: 'cm' | 'ft' };
  weight: { value: number; unit: 'kg' | 'lbs' };
  bmi?: number;
  bmiCategory?: string;
  targetWeight: { value: number; unit: 'kg' | 'lbs' };
  allergies: string[];
  foodAllergies: string[];
  healthConditions: string[];
}

interface HealthQuestionnaireProps {
  onComplete: (data: HealthData) => void;
}

export function HealthQuestionnaire({ onComplete }: HealthQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthData, setHealthData] = useState<HealthData>({
    age: 0,
    height: { value: 0, unit: 'cm' },
    weight: { value: 0, unit: 'kg' },
    targetWeight: { value: 0, unit: 'kg' },
    allergies: [],
    foodAllergies: [],
    healthConditions: []
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const calculateBMI = (weight: number, height: number, heightUnit: 'cm' | 'ft') => {
    let heightInM = heightUnit === 'cm' ? height / 100 : height * 0.3048;
    const bmi = weight / (heightInM * heightInM);
    let category = '';
    
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    return { bmi: Math.round(bmi * 10) / 10, category };
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const { bmi, category } = calculateBMI(
        healthData.weight.value,
        healthData.height.value,
        healthData.height.unit
      );
      setHealthData(prev => ({ ...prev, bmi, bmiCategory: category }));
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleSkip = () => {
    if (currentStep === totalSteps) {
      onComplete(healthData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    onComplete(healthData);
  };

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Normal': return 'text-green-600 bg-green-100';
      case 'Overweight': case 'Obese': return 'text-red-600 bg-red-100';
      case 'Underweight': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const allergenOptions = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 
    'Soy', 'Wheat', 'Sesame', 'Other'
  ];

  const conditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 
    'High Cholesterol', 'Arthritis', 'None', 'Other'
  ];

  const stepIcons = [User, Scale, Target, AlertTriangle, Heart];
  const StepIcon = stepIcons[currentStep - 1];

  const stepTitles = [
    "Basic Information",
    "Your BMI Result", 
    "Target Weight",
    "Allergies",
    "Health Conditions"
  ];

  const stepDescriptions = [
    "Tell us about yourself",
    "Let's analyze your health status",
    "Set your wellness goals",
    "Help us keep you safe",
    "Understand your health needs"
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Enhanced Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Step {currentStep} of {totalSteps}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stepDescriptions[currentStep - 1]}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden"
            />
            <motion.div
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentStep
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500'
                    : i === currentStep - 1
                    ? 'bg-gradient-to-r from-emerald-400 to-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl">
              <CardHeader className="text-center pb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                >
                  <StepIcon className="w-8 h-8 text-white" />
                </motion.div>
                
                <CardTitle className="text-2xl text-gray-800 dark:text-gray-200 mb-2">
                  {stepTitles[currentStep - 1]}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  {stepDescriptions[currentStep - 1]}
                </p>
              </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What is your age?
                  </label>
                  <Input
                    type="number"
                    value={healthData.age || ''}
                    onChange={(e) => setHealthData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    className="h-14 rounded-2xl text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What is your height?
                  </label>
                  <div className="flex space-x-3">
                    <Input
                      type="number"
                      value={healthData.height.value || ''}
                      onChange={(e) => setHealthData(prev => ({
                        ...prev,
                        height: { ...prev.height, value: parseFloat(e.target.value) || 0 }
                      }))}
                      className="h-14 rounded-2xl flex-1 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                      placeholder="Height"
                      min="1"
                      step="0.1"
                    />
                    <Select
                      value={healthData.height.unit}
                      onValueChange={(value: 'cm' | 'ft') => 
                        setHealthData(prev => ({ ...prev, height: { ...prev.height, unit: value } }))
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl w-24 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What is your weight?
                  </label>
                  <div className="flex space-x-3">
                    <Input
                      type="number"
                      value={healthData.weight.value || ''}
                      onChange={(e) => setHealthData(prev => ({
                        ...prev,
                        weight: { ...prev.weight, value: parseFloat(e.target.value) || 0 }
                      }))}
                      className="h-14 rounded-2xl flex-1 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                      placeholder="Weight"
                      min="1"
                      step="0.1"
                    />
                    <Select
                      value={healthData.weight.unit}
                      onValueChange={(value: 'kg' | 'lbs') => 
                        setHealthData(prev => ({ ...prev, weight: { ...prev.weight, unit: value } }))
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl w-24 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: BMI Result */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl">
                    <Scale className="w-16 h-16 text-white" />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {healthData.bmi}
                  </div>
                  <Badge className={`${getBMIColor(healthData.bmiCategory || '')} px-6 py-3 rounded-2xl text-lg font-medium`}>
                    {healthData.bmiCategory}
                  </Badge>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-6 rounded-2xl bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10"
                >
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {healthData.bmiCategory === 'Normal' && "🎉 Excellent! You're in the healthy weight range. Let's maintain this with nutritious recipes!"}
                    {healthData.bmiCategory === 'Underweight' && "💪 Let's focus on healthy weight gain with nutrient-rich, calorie-dense meals."}
                    {healthData.bmiCategory === 'Overweight' && "🌱 Great start! We'll create delicious, balanced recipes to support your wellness journey."}
                    {healthData.bmiCategory === 'Obese' && "🌟 You're taking an important step! Together we'll build healthy habits with tasty, nourishing meals."}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Target Weight */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Setting realistic goals helps you track progress and stay motivated on your wellness journey.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What is your target weight?
                  </label>
                  <div className="flex space-x-3">
                    <Input
                      type="number"
                      value={healthData.targetWeight.value || ''}
                      onChange={(e) => setHealthData(prev => ({
                        ...prev,
                        targetWeight: { ...prev.targetWeight, value: parseFloat(e.target.value) || 0 }
                      }))}
                      className="h-14 rounded-2xl flex-1 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                      placeholder="Target weight"
                      min="1"
                      step="0.1"
                    />
                    <Select
                      value={healthData.targetWeight.unit}
                      onValueChange={(value: 'kg' | 'lbs') => 
                        setHealthData(prev => ({ ...prev, targetWeight: { ...prev.targetWeight, unit: value } }))
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl w-24 text-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 Tip: Aim for gradual, sustainable changes. A healthy weight loss is typically 0.5-1 kg (1-2 lbs) per week.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 4: Allergies */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Help us keep you safe by sharing any allergies you have. We'll make sure to exclude them from your recipes.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Do you have any allergies?
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Food', 'Dust', 'Pollen', 'Medicine', 'Other'].map((allergy, index) => (
                      <motion.div
                        key={allergy}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center p-4 rounded-xl bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
                      >
                        <Checkbox
                          id={allergy}
                          checked={healthData.allergies.includes(allergy)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setHealthData(prev => ({
                                ...prev,
                                allergies: [...prev.allergies, allergy]
                              }));
                            } else {
                              setHealthData(prev => ({
                                ...prev,
                                allergies: prev.allergies.filter(a => a !== allergy)
                              }));
                            }
                          }}
                          className="w-5 h-5 mr-3"
                        />
                        <label htmlFor={allergy} className="text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                          {allergy}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {healthData.allergies.includes('Food') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Which foods are you allergic to?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {allergenOptions.map((allergen, index) => (
                          <motion.div
                            key={allergen}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50 hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-all duration-300"
                          >
                            <Checkbox
                              id={allergen}
                              checked={healthData.foodAllergies.includes(allergen)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setHealthData(prev => ({
                                    ...prev,
                                    foodAllergies: [...prev.foodAllergies, allergen]
                                  }));
                                } else {
                                  setHealthData(prev => ({
                                    ...prev,
                                    foodAllergies: prev.foodAllergies.filter(a => a !== allergen)
                                  }));
                                }
                              }}
                              className="w-4 h-4 mr-2"
                            />
                            <label htmlFor={allergen} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                              {allergen}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Step 5: Health Conditions */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-red-400 via-pink-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Share any health conditions so we can create recipes that support your specific wellness needs.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Do you have any health conditions?
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {conditionOptions.map((condition, index) => (
                      <motion.div
                        key={condition}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-center p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                          condition === 'None'
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30'
                            : 'bg-white/30 dark:bg-black/30 border-white/20 dark:border-white/10 hover:bg-white/40 dark:hover:bg-black/40'
                        }`}
                      >
                        <Checkbox
                          id={condition}
                          checked={healthData.healthConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (condition === 'None') {
                                // If "None" is selected, clear all other selections
                                setHealthData(prev => ({
                                  ...prev,
                                  healthConditions: ['None']
                                }));
                              } else {
                                // If any other condition is selected, remove "None"
                                setHealthData(prev => ({
                                  ...prev,
                                  healthConditions: [...prev.healthConditions.filter(c => c !== 'None'), condition]
                                }));
                              }
                            } else {
                              setHealthData(prev => ({
                                ...prev,
                                healthConditions: prev.healthConditions.filter(c => c !== condition)
                              }));
                            }
                          }}
                          className="w-5 h-5 mr-3"
                        />
                        <label 
                          htmlFor={condition} 
                          className="text-lg font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                        >
                          {condition === 'None' ? '✅ None of the above' : condition}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      🔒 Your health information is private and secure. We use it only to personalize your recipe recommendations.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-4 pt-8"
            >
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                  className="h-14 px-6 rounded-2xl border-2 border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 h-14 rounded-2xl border-2 border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70 transition-all duration-300 text-lg"
              >
                Skip for Now
              </Button>
              
              <Button
                onClick={currentStep === totalSteps ? handleFinish : handleNext}
                disabled={
                  (currentStep === 1 && (!healthData.age || !healthData.height.value || !healthData.weight.value)) ||
                  (currentStep === 3 && !healthData.targetWeight.value)
                }
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{currentStep === totalSteps ? 'Complete' : 'Continue'}</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}