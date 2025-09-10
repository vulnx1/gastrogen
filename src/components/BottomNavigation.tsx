import { motion } from "motion/react";
import { 
  Home, 
  ChefHat, 
  MessageCircle, 
  Camera, 
  Puzzle, 
  Users, 
  User 
} from "lucide-react";

interface BottomNavigationProps {
  currentState: string;
  onNavigate: (state: any) => void;
}

export function BottomNavigation({ currentState, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'recipes', icon: ChefHat, label: 'Recipes' },
    { id: 'coach', icon: MessageCircle, label: 'Coach' },
    { id: 'food-recognition', icon: Camera, label: 'Scan' },
    { id: 'recipe-builder', icon: Puzzle, label: 'Builder' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/20 dark:bg-black/20 backdrop-blur-2xl border-t border-white/20 dark:border-white/10"
    >
      <div className="flex items-center justify-around px-4 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = currentState === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                layout
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}