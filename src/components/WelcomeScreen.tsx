import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { motion } from "motion/react";
import { Target, Utensils, TrendingUp, ArrowRight, Sparkles, Heart } from "lucide-react";

interface WelcomeScreenProps {
  userName: string;
  onStartHealthCheck: () => void;
}

export function WelcomeScreen({ userName, onStartHealthCheck }: WelcomeScreenProps) {
  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);
  
  const features = [
    {
      icon: Target,
      title: "Personalized Health Insights",
      description: "Get tailored recommendations based on your unique profile",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100/50 dark:bg-emerald-900/20"
    },
    {
      icon: Utensils,
      title: "AI-Powered Recipe Recommendations",
      description: "Discover recipes that match your health goals and preferences",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100/50 dark:bg-blue-900/20"
    },
    {
      icon: TrendingUp,
      title: "Track Your Wellness Journey",
      description: "Monitor progress and celebrate your health milestones",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100/50 dark:bg-cyan-900/20"
    }
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl relative overflow-hidden"
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
              <Heart className="w-12 h-12 text-white relative z-10" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl mb-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Welcome, {firstName}!
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Let's discover your health profile and create personalized recipes. 
                Our AI will craft the perfect wellness plan just for you.
              </p>
            </motion.div>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center p-4 rounded-2xl ${feature.bgColor} backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mr-4 shadow-sm`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onStartHealthCheck}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span className="flex items-center justify-center space-x-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Begin Your Health Journey</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              Takes just 2 minutes • Completely personalized • AI-powered insights
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}