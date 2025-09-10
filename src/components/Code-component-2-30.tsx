import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users, 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Crown, 
  Medal,
  ChevronRight,
  TrendingUp,
  Calendar,
  Award,
  Zap
} from "lucide-react";

interface CommunityProps {
  userName: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: string;
  reward: number;
  participants: number;
  timeLeft: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  streak: number;
  badges: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  earned: boolean;
  progress?: number;
  requirement: string;
}

export function Community({ userName }: CommunityProps) {
  const [activeTab, setActiveTab] = useState('challenges');
  const firstName = userName.split('@')[0].charAt(0).toUpperCase() + userName.split('@')[0].slice(1);

  const challenges: Challenge[] = [
    {
      id: '1',
      title: '10K Steps Daily',
      description: 'Walk 10,000 steps every day this week',
      type: 'weekly',
      target: 70000,
      current: 45000,
      unit: 'steps',
      reward: 500,
      participants: 1247,
      timeLeft: '3 days',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: '2',
      title: 'Healthy Recipe Share',
      description: 'Share 3 healthy recipes this month',
      type: 'monthly',
      target: 3,
      current: 1,
      unit: 'recipes',
      reward: 1000,
      participants: 856,
      timeLeft: '12 days',
      icon: Trophy,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: '3',
      title: 'Meditation Streak',
      description: 'Meditate for 10 minutes daily',
      type: 'daily',
      target: 10,
      current: 7,
      unit: 'minutes',
      reward: 100,
      participants: 2103,
      timeLeft: '8 hours',
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: '4',
      title: 'Water Intake Goal',
      description: 'Drink 8 glasses of water daily',
      type: 'daily',
      target: 8,
      current: 6,
      unit: 'glasses',
      reward: 75,
      participants: 1892,
      timeLeft: '5 hours',
      icon: Zap,
      color: 'text-cyan-600 dark:text-cyan-400'
    }
  ];

  const leaderboard: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b932?w=100',
      points: 12450,
      rank: 1,
      streak: 28,
      badges: ['streak-master', 'recipe-king', 'step-champion']
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
      points: 11230,
      rank: 2,
      streak: 15,
      badges: ['fitness-guru', 'healthy-eater']
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      points: 10890,
      rank: 3,
      streak: 22,
      badges: ['meditation-master', 'step-champion']
    },
    {
      id: '4',
      name: firstName,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      points: 8750,
      rank: 12,
      streak: 8,
      badges: ['newcomer', 'recipe-sharer']
    }
  ];

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Step Champion',
      description: 'Walk 10,000 steps in a day',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      earned: true,
      requirement: '10,000 steps daily'
    },
    {
      id: '2',
      name: 'Recipe Master',
      description: 'Share 10 healthy recipes',
      icon: Trophy,
      color: 'text-emerald-600 dark:text-emerald-400',
      earned: false,
      progress: 30,
      requirement: '10 recipes shared'
    },
    {
      id: '3',
      name: 'Streak Master',
      description: 'Maintain a 30-day healthy habit streak',
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      earned: false,
      progress: 26,
      requirement: '30-day streak'
    },
    {
      id: '4',
      name: 'Wellness Guru',
      description: 'Complete 50 challenges',
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      earned: false,
      progress: 15,
      requirement: '50 challenges completed'
    },
    {
      id: '5',
      name: 'Community Helper',
      description: 'Help 20 community members',
      icon: Users,
      color: 'text-pink-600 dark:text-pink-400',
      earned: true,
      requirement: 'Help 20 members'
    },
    {
      id: '6',
      name: 'Early Bird',
      description: 'Complete morning workouts for 7 days',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      earned: false,
      progress: 60,
      requirement: '7 morning workouts'
    }
  ];

  const userStats = {
    totalPoints: 8750,
    rank: 12,
    challengesCompleted: 23,
    streak: 8,
    badgesEarned: 2
  };

  return (
    <div className="min-h-screen pb-24 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
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
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent mb-2">
            Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join challenges, earn badges, and connect with fellow wellness enthusiasts
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {userStats.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                #{userStats.rank}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rank</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userStats.challengesCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {userStats.streak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {userStats.badgesEarned}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Badges</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
              <TabsTrigger value="challenges" className="rounded-xl">Challenges</TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-xl">Leaderboard</TabsTrigger>
              <TabsTrigger value="badges" className="rounded-xl">Badges</TabsTrigger>
            </TabsList>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl bg-white/30 dark:bg-black/30`}>
                              <challenge.icon className={`w-5 h-5 ${challenge.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{challenge.title}</CardTitle>
                              <Badge variant="outline" className="mt-1 bg-white/50 dark:bg-black/50">
                                {challenge.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {challenge.timeLeft} left
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              +{challenge.reward} points
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {challenge.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {challenge.current.toLocaleString()}/{challenge.target.toLocaleString()} {challenge.unit}
                            </span>
                          </div>
                          <Progress 
                            value={(challenge.current / challenge.target) * 100} 
                            className="h-2" 
                          />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{challenge.participants.toLocaleString()} participants</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg"
                            >
                              Join Challenge
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-6">
              <Card className="border-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span>Top Performers This Week</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                          user.name === firstName 
                            ? 'bg-emerald-100/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {user.rank <= 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              user.rank === 1 ? 'bg-yellow-500' :
                              user.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                            }`}>
                              {user.rank === 1 && <Crown className="w-4 h-4 text-white" />}
                              {user.rank === 2 && <Medal className="w-4 h-4 text-white" />}
                              {user.rank === 3 && <Award className="w-4 h-4 text-white" />}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                              {user.rank}
                            </div>
                          )}
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">
                              {user.name}
                              {user.name === firstName && (
                                <Badge variant="outline" className="ml-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                  You
                                </Badge>
                              )}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{user.points.toLocaleString()} points</span>
                            <span className="flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span>{user.streak} day streak</span>
                            </span>
                            <span>{user.badges.length} badges</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                            <div
                              key={badgeIndex}
                              className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                              title={badge}
                            >
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          ))}
                          {user.badges.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{user.badges.length - 3}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-0 backdrop-blur-2xl transition-all duration-300 ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-yellow-100/50 to-orange-100/50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800' 
                        : 'bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30'
                    }`}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                          badge.earned 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <badge.icon className={`w-8 h-8 ${
                            badge.earned ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        </div>
                        
                        <h3 className={`font-semibold mb-2 ${
                          badge.earned 
                            ? 'text-gray-800 dark:text-gray-200' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {badge.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {badge.description}
                        </p>
                        
                        {badge.earned ? (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            Earned
                          </Badge>
                        ) : badge.progress !== undefined ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="font-medium">{badge.progress}%</span>
                            </div>
                            <Progress value={badge.progress} className="h-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {badge.requirement}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                            Locked
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}