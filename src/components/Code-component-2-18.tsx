import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { HealthData } from "./HealthQuestionnaire";
import { WearableData } from "../App";
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Bot, 
  User, 
  Heart, 
  TrendingUp, 
  Lightbulb,
  Target,
  Zap,
  Clock
} from "lucide-react";

interface AIHealthCoachProps {
  healthData: HealthData;
  userName: string;
  wearableData: WearableData;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'insight';
}

export function AIHealthCoach({ healthData, userName, wearableData }: AIHealthCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello ${firstName}! I'm your AI Health Coach. I've analyzed your health profile and I'm here to help you achieve your wellness goals. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [firstName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Simple AI responses based on keywords and health data
    if (input.includes('tired') || input.includes('fatigue')) {
      return `I understand you're feeling tired. Based on your sleep data (${wearableData.sleep}h last night), you might benefit from aiming for 8+ hours of sleep. Also, consider a 10-minute walk - it can boost energy naturally!`;
    }
    
    if (input.includes('weight') || input.includes('lose')) {
      const targetDiff = (healthData.weight.value || 0) - (healthData.targetWeight.value || 0);
      return `Great question about weight management! You're aiming to ${targetDiff > 0 ? 'lose' : 'gain'} ${Math.abs(targetDiff)} ${healthData.weight.unit}. With your current BMI of ${healthData.bmi}, I recommend focusing on nutrient-dense foods and staying within your ${Math.round(wearableData.calories * 0.85)}-${wearableData.calories} calorie range.`;
    }
    
    if (input.includes('exercise') || input.includes('workout') || input.includes('steps')) {
      return `You've taken ${wearableData.steps.toLocaleString()} steps today - that's ${Math.round((wearableData.steps / 10000) * 100)}% of your goal! For your fitness level, I suggest adding 2-3 strength training sessions per week to complement your cardio.`;
    }
    
    if (input.includes('food') || input.includes('eat') || input.includes('meal')) {
      const avoidFoods = healthData.foodAllergies.length > 0 ? ` (avoiding ${healthData.foodAllergies.join(', ')})` : '';
      return `Based on your profile${avoidFoods}, I recommend focusing on lean proteins, complex carbs, and healthy fats. Would you like me to suggest some personalized recipes that fit your goals?`;
    }
    
    if (input.includes('stress') || input.includes('anxiety')) {
      return `Stress management is crucial for overall health. Your heart rate data shows you're generally in a good range. Try deep breathing exercises, meditation, or a short walk. Your body and mind will thank you!`;
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('how')) {
      return `I'm doing great, thank you for asking! I'm here to support your wellness journey. Looking at your data, you're making good progress. Is there anything specific you'd like to discuss about your health goals?`;
    }
    
    // Default responses
    const responses = [
      `That's a great question! Based on your health profile, I'd recommend focusing on consistency with your current routine. Small, sustainable changes often lead to the best long-term results.`,
      `I'm always here to help! Your health journey is unique, and I'm analyzing your data to provide personalized insights. What specific area would you like to focus on today?`,
      `Excellent! Your commitment to health is inspiring. Remember, progress isn't always linear - celebrate the small wins along the way. How can I support you today?`,
      `That's wonderful that you're staying engaged with your health! Based on your recent activity (${wearableData.steps} steps), you're doing great. What other aspects of wellness are you curious about?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(inputValue),
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // In a real app, you'd implement speech recognition here
    setTimeout(() => setIsListening(false), 3000);
  };

  const quickSuggestions = [
    { text: "How can I improve my sleep?", icon: Clock },
    { text: "Suggest healthy recipes", icon: Heart },
    { text: "Review my progress", icon: TrendingUp },
    { text: "Tips for more energy", icon: Zap },
  ];

  const insights = [
    {
      title: "Daily Goal Progress",
      description: `You're ${Math.round((wearableData.steps / 10000) * 100)}% towards your step goal`,
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Heart Health",
      description: `Resting HR: ${wearableData.heartRate} bpm (Excellent)`,
      icon: Heart,
      color: "text-red-600 dark:text-red-400"
    },
    {
      title: "Sleep Quality",
      description: `${wearableData.sleep}h sleep (Target: 8h)`,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen pb-24 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent mb-2">
            AI Health Coach
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal wellness companion
          </p>
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {insights.map((insight, index) => (
            <Card key={index} className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-white/30 dark:bg-black/30">
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 overflow-hidden"
        >
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-white ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                        : 'bg-white/30 dark:bg-black/30 text-gray-800 dark:text-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className={`text-xs mt-2 block opacity-70 ${
                        message.sender === 'user' ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-4 rounded-2xl bg-white/30 dark:bg-black/30">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="p-4 border-t border-white/20 dark:border-white/10">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion.text)}
                  className="text-xs rounded-full border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30"
                >
                  <suggestion.icon className="w-3 h-3 mr-1" />
                  {suggestion.text}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your health..."
                  className="h-12 rounded-2xl bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20 pr-12"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl ${
                    isListening ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : 'text-gray-500'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}