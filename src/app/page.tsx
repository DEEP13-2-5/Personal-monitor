'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion} from 'framer-motion';
import { 
  LayoutDashboard, BarChart2, Settings as SettingsIcon,Calendar, TrendingUp, Award,
  Menu, Bell, Search, Moon, Sun, X, Flag, ChevronRight, ChevronLeft,
  Zap, Droplet, Monitor, Clock, Dumbbell, CheckCircle2, Circle, Filter, Edit, 
  Trash2, MoreHorizontal, ArrowUpRight, ArrowDownRight, PlayCircle, 
  PauseCircle, Check, RotateCcw, PlusCircle
} from 'lucide-react';

// ====== Utility Functions ======
function cn(...inputs: Array<string | boolean | undefined | null>): string {
  return inputs.filter(Boolean).join(' ');
}

// ====== Types ======
type View = 'dashboard' | 'analytics' | 'settings';
type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
type Category = 'Health' | 'Fitness' | 'Productivity' | 'Mindfulness' | 'Learning';

interface Habit {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  streak: number;
  timeOfDay: TimeOfDay;
  category: Category;
  created: string;
  progress: number;
  target?: number;
  consistency: number;
  change: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: 'calendar' | 'flag';
  read: boolean;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
  streak: number;
  waterIntake: number;
  sleepHours: number;
  screenTime: number;
  exerciseMinutes: number;
  notifications: Notification[];
}

interface HabitContextType {
  habits: Habit[];
  userData: UserData;
  addHabit: (habit: Omit<Habit, 'id' | 'created' | 'progress' | 'consistency' | 'change'>) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateUserStats: (stats: Partial<UserData>) => void;
}

// ====== Mock Data ======
const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink 2L of water',
    description: 'Stay hydrated throughout the day',
    isCompleted: true,
    streak: 5,
    timeOfDay: 'Anytime',
    category: 'Health',
    created: '2025-04-28',
    progress: 75,
    target: 2000,
    consistency: 85,
    change: 5,
  },
  {
    id: '2',
    name: 'Meditate for 10 minutes',
    description: 'Practice mindfulness',
    isCompleted: false,
    streak: 2,
    timeOfDay: 'Morning',
    category: 'Mindfulness',
    created: '2025-04-25',
    progress: 40,
    target: 10,
    consistency: 60,
    change: -8,
  },
  {
    id: '3',
    name: 'Read for 30 minutes',
    description: 'Read a book or article',
    isCompleted: true,
    streak: 7,
    timeOfDay: 'Evening',
    category: 'Learning',
    created: '2025-04-20',
    progress: 90,
    target: 30,
    consistency: 92,
    change: 2,
  },
  {
    id: '4',
    name: 'Exercise',
    description: 'Complete daily workout routine',
    isCompleted: false,
    streak: 0,
    timeOfDay: 'Afternoon',
    category: 'Fitness',
    created: '2025-04-27',
    progress: 25,
    target: 45,
    consistency: 45,
    change: -12,
  },
  {
    id: '5',
    name: 'Code for 1 hour',
    description: 'Work on personal projects',
    isCompleted: true,
    streak: 3,
    timeOfDay: 'Evening',
    category: 'Productivity',
    created: '2025-04-26',
    progress: 60,
    target: 60,
    consistency: 75,
    change: 5,
  },
];

const initialUserData: UserData = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  streak: 5,
  waterIntake: 1800,
  sleepHours: 7.5,
  screenTime: 3.2,
  exerciseMinutes: 45,
  notifications: [
    {
      id: 'n1',
      title: 'Habit Streak',
      message: 'You reached a 5-day streak for "Drink 2L of water"!',
      time: '2 hours ago',
      icon: 'flag',
      read: false,
    },
    {
      id: 'n2',
      title: 'Reminder',
      message: 'Don\'t forget to meditate today',
      time: '5 hours ago',
      icon: 'calendar',
      read: false,
    },
    {
      id: 'n3',
      title: 'Goal Completed',
      message: 'You completed your reading goal yesterday',
      time: 'Yesterday',
      icon: 'flag',
      read: true,
    },
  ],
};

// ====== Context ======
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// ====== Provider Component ======
function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const addHabit = (habit: Omit<Habit, 'id' | 'created' | 'progress' | 'consistency' | 'change'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substring(2, 9),
      created: new Date().toISOString().slice(0, 10),
      progress: 0,
      consistency: Math.floor(Math.random() * 30) + 40, // Generate a realistic consistency value
      change: Math.floor(Math.random() * 20) - 10, // Generate a random change (-10 to +10)
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          // Update streak when completing a habit
          const updatedStreak = habit.isCompleted ? habit.streak : habit.streak + 1;
          // Update progress based on completion state
          const updatedProgress = habit.isCompleted ? habit.progress - 10 : habit.progress + 10;
          
          return {
            ...habit,
            isCompleted: !habit.isCompleted,
            streak: updatedStreak,
            progress: Math.min(Math.max(updatedProgress, 0), 100), // Ensure progress is between 0-100
          };
        }
        return habit;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const updateUserStats = (stats: Partial<UserData>) => {
    setUserData({ ...userData, ...stats });
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        userData,
        addHabit,
        toggleHabit,
        deleteHabit,
        updateUserStats,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

// Custom hook for using the context
function useHabit(): HabitContextType {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}

// ====== Theme Provider ======
const ThemeContext = createContext<{ theme: string; setTheme: (theme: string) => void } | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ====== Components ======
// Habit Overview Component
function HabitOverview() {
  const { userData } = useHabit();
  
  const habitStats = [
    {
      id: 'streak',
      name: 'Current Streak',
      value: userData.streak,
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      change: '+2 days',
      isUp: true,
    },
    {
      id: 'water',
      name: 'Water Intake',
      value: `${userData.waterIntake} ml`,
      icon: Droplet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      change: '-200 ml',
      isUp: false,
    },
    {
      id: 'sleep',
      name: 'Sleep Duration',
      value: `${userData.sleepHours} hours`,
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      change: '+30 min',
      isUp: true,
    },
    {
      id: 'screen',
      name: 'Screen Time',
      value: `${userData.screenTime} hours`,
      icon: Clock,
      color: 'text-rose-500',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
      change: '-45 min',
      isUp: false,
    },
    {
      id: 'exercise',
      name: 'Exercise',
      value: `${userData.exerciseMinutes} mins`,
      icon: Dumbbell,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      change: '+15 min',
      isUp: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {habitStats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-4 border rounded-lg shadow-sm bg-card border-border"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
              <div className="flex items-center mt-1">
                <span className={`text-xs ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">vs yesterday</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Habit List Component
function HabitList() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { habits, toggleHabit, deleteHabit } = useHabit();
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    if (filter === 'active') return !habit.isCompleted;
    if (filter === 'completed') return habit.isCompleted;
    return true;
  });

  const toggleExpand = (id: string) => {
    if (expandedHabitId === id) {
      setExpandedHabitId(null);
    } else {
      setExpandedHabitId(id);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Your Habits</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1 text-sm rounded-md",
              filter === 'all' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={cn(
              "px-3 py-1 text-sm rounded-md",
              filter === 'active' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={cn(
              "px-3 py-1 text-sm rounded-md",
              filter === 'completed' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Completed
          </button>
          <button 
            className="p-1 rounded-md hover:bg-muted"
            aria-label="Filter options"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-0">
        {filteredHabits.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No habits found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredHabits.map((habit) => (
              <motion.li 
                key={habit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                className="relative"
              >
                <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="p-1 rounded-full hover:bg-muted"
                      aria-label={habit.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {habit.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="ml-3">
                      <p className={cn(
                        "font-medium",
                        habit.isCompleted && "line-through text-muted-foreground"
                      )}>
                        {habit.name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {habit.timeOfDay} • Streak: {habit.streak} days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div 
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        habit.isCompleted 
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      )}
                    >
                      {habit.category}
                    </div>
                    
                    <div className="flex items-center ml-2">
                      <button
                        onClick={() => toggleExpand(habit.id)}
                        className="p-1 rounded-md hover:bg-muted"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {expandedHabitId === habit.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 border-t border-border/50"
                  >
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-full max-w-xs bg-muted/50 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-primary"
                              style={{ width: `${habit.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {habit.progress}%
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <ArrowUpRight className={cn(
                              "w-4 h-4 mr-1",
                              habit.change > 0 ? "text-emerald-500" : ""
                            )} />
                            <span>{habit.consistency}% consistency</span>
                          </div>
                          <div className="flex items-center">
                            <ArrowDownRight className={cn(
                              "w-4 h-4 mr-1",
                              habit.change < 0 ? "text-rose-500" : ""
                            )} />
                            <span>{habit.change > 0 ? '+' : ''}{habit.change}% change</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          aria-label="Edit habit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteHabit(habit.id)}
                          className="p-2 text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Daily Check-in Component
function DailyCheckIn() {
  const { userData, updateUserStats } = useHabit();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [trackers, setTrackers] = useState({
    water: userData.waterIntake,
    sleep: userData.sleepHours,
    exercise: userData.exerciseMinutes,
    screen: userData.screenTime
  });

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerActive]);

  const handleTimerToggle = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerActive(false);
  };

  const updateTracker = (tracker: keyof typeof trackers, delta: number) => {
    // Create a minimum value map to prevent negative values
    const minValues = {
      water: 0,
      sleep: 0,
      exercise: 0,
      screen: 0
    };
    
    const newValue = Math.max(trackers[tracker] + delta, minValues[tracker]);
    setTrackers({
      ...trackers,
      [tracker]: newValue
    });
  };

  const handleCheckin = () => {
    // Update user data with new tracker values
    updateUserStats({
      waterIntake: trackers.water,
      sleepHours: trackers.sleep,
      exerciseMinutes: trackers.exercise,
      screenTime: trackers.screen
    });
    
    setIsCheckedIn(true);
    
    // Reset after 2 seconds for visual feedback
    setTimeout(() => {
      setIsCheckedIn(false);
    }, 2000);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Daily Check-in</h2>
        <p className="text-sm text-muted-foreground">Track your daily stats</p>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Water Intake */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-2">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Water Intake (ml)</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('water', -100)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                -
              </motion.button>
              <span className="w-16 text-center font-semibold">{trackers.water}</span>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('water', 100)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                +
              </motion.button>
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(trackers.water / 2500) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 ml</span>
            <span>Target: 2500 ml</span>
          </div>
        </div>
        
        {/* Sleep Hours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-2">
                <Moon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Sleep (hours)</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('sleep', -0.5)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                -
              </motion.button>
              <span className="w-16 text-center font-semibold">{trackers.sleep}</span>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('sleep', 0.5)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                +
              </motion.button>
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(trackers.sleep / 9) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 hrs</span>
            <span>Target: 9 hrs</span>
          </div>
        </div>
        
        {/* Exercise Minutes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 mr-2">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Exercise (mins)</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('exercise', -5)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                -
              </motion.button>
              <span className="w-16 text-center font-semibold">{trackers.exercise}</span>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('exercise', 5)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                +
              </motion.button>
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(trackers.exercise / 60) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 mins</span>
            <span>Target: 60 mins</span>
          </div>
        </div>
        
        {/* Screen Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 mr-2">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Screen Time (hrs)</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('screen', -0.1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                -
              </motion.button>
              <span className="w-16 text-center font-semibold">{trackers.screen.toFixed(1)}</span>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTracker('screen', 0.1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                +
              </motion.button>
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-rose-500 transition-all duration-300"
              style={{ width: `${(trackers.screen / 8) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 hrs</span>
            <span>Limit: 8 hrs</span>
          </div>
        </div>
        
        {/* Activity Timer */}
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="text-sm font-medium mb-3">Activity Timer</h3>
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl font-mono font-semibold">
              {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleTimerToggle}
                className={cn(
                  "p-2 rounded-full",
                  isTimerActive 
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                )}
              >
                {isTimerActive ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Check-in Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckin}
          disabled={isCheckedIn}
          className={cn(
            "w-full py-3 mt-4 rounded-md font-medium transition-colors",
            isCheckedIn 
              ? "bg-emerald-500 text-white cursor-default" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isCheckedIn ? (
            <div className="flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Checked In!</span>
            </div>
          ) : (
            "Check In for Today"
          )}
        </motion.button>
      </div>
    </div>
  );
}

// New Habit Modal Component
function NewHabitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addHabit } = useHabit();
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Anytime');
  const [category, setCategory] = useState<Category>('Health');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (habitName.trim() === '') return;
    
    addHabit({
      name: habitName,
      description: habitDescription,
      isCompleted: false,
      streak: 0,
      timeOfDay,
      category,
    });
    
    // Reset form and close modal
    setHabitName('');
    setHabitDescription('');
    setTimeOfDay('Anytime');
    setCategory('Health');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Habit</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Name */}
          <div>
            <label htmlFor="habitName" className="block mb-2 text-sm font-medium">
              Habit Name
            </label>
            <input
              type="text"
              id="habitName"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Drink water, Meditate, Read..."
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Add details about your habit..."
              rows={3}
            />
          </div>
          
          {/* Time of Day */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Time of Day
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeOfDay(time as TimeOfDay)}
                  className={cn(
                    "px-4 py-2 text-sm border rounded-md",
                    timeOfDay === time
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {['Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as Category)}
                  className={cn(
                    "px-4 py-2 text-sm border rounded-md",
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md bg-background hover:bg-muted"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            >
              Add Habit
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Navbar Component
function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const { userData } = useHabit();
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur-sm border-border">
      <div className="flex items-center lg:w-64">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="hidden text-xl font-semibold md:block">Habitify</h1>
      </div>

      <div className="hidden md:flex items-center flex-1 mx-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search habits, activities..."
            className="w-full py-2 pl-10 pr-4 text-sm border rounded-full bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleThemeToggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>

        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {userData.notifications.length > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white rounded-full bg-destructive">
                {userData.notifications.length}
              </span>
            )}
          </motion.button>

          {showNotifications && (
            <NotificationsDropdown 
              notifications={userData.notifications} 
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <div className="relative flex items-center ml-2">
          <div className="w-8 h-8 overflow-hidden rounded-full bg-primary/10">
            <img 
              src={userData.avatar} 
              alt="Profile" 
              className="object-cover w-full h-full"
            />
          </div>
          <span className="hidden ml-2 text-sm font-medium md:block">
            {userData.name}
          </span>
        </div>
      </div>
    </header>
  );
}

// Notifications Dropdown Component
function NotificationsDropdown({ 
  notifications, 
  onClose 
}: { 
  notifications: Notification[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 w-80 mt-2 overflow-hidden bg-card rounded-lg shadow-lg border border-border z-50"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer flex items-start gap-3",
                  !notification.read && "bg-muted/30"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  notification.icon === 'calendar' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : 
                  "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  {notification.icon === 'calendar' ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <Flag className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-1 text-xs text-muted-foreground">{notification.time}</div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 mt-1 rounded-full bg-blue-500"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 text-center border-t border-border">
          <button className="text-sm font-medium text-primary hover:underline">
            Mark all as read
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Sidebar Component
function Sidebar({ 
  isOpen, 
  currentView, 
  setCurrentView 
}: { 
  isOpen: boolean; 
  currentView: string; 
  setCurrentView: (view: View) => void;
}) {
  const { userData } = useHabit();
  
  const sidebarVariants = {
    open: { 
      width: '16rem',
      transition: { duration: 0.3 }
    },
    closed: { 
      width: '0rem',
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const mainNavItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: 'dashboard' },
    { title: 'Analytics', icon: BarChart2, href: 'analytics' },
    { title: 'Settings', icon: Settings, href: 'settings' },
  ];

  const otherNavItems = [
    { title: 'Calendar', icon: Calendar, href: '#' },
    { title: 'Progress', icon: TrendingUp, href: '#' },
    { title: 'Achievements', icon: Award, href: '#' },
  ];

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      className={cn(
        "fixed left-0 z-20 h-full bg-card border-r border-border overflow-hidden",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            className="flex items-center"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">H</span>
            </div>
            <h1 className="text-xl font-semibold">Habitify</h1>
          </motion.div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
          >
            <div className="mb-6">
              <h2 className="mb-2 text-xs font-semibold text-muted-foreground">MAIN</h2>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setCurrentView(item.href as View)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                      currentView === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-xs font-semibold text-muted-foreground">TOOLS</h2>
              <nav className="space-y-1">
                {otherNavItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm rounded-md text-foreground hover:bg-muted transition-colors"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={contentVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          className="p-4 border-t border-border"
        >
          <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
            <div className="w-8 h-8 mr-2 overflow-hidden rounded-full bg-primary/10">
              <img
                src={userData.avatar}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userData.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Analytics Component
function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Visualize your habit data and progress</p>
      </div>
      
      <div className="p-8 text-center border rounded-lg bg-card">
        <div className="flex flex-col items-center justify-center h-64">
          <BarChart2 className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Analytics Dashboard</h3>
          <p className="max-w-md mt-2 text-muted-foreground">
            Track your habits and personal metrics with comprehensive charts and visualizations.
          </p>
        </div>
      </div>
    </div>
  );
}

// Settings Component
function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="p-8 text-center border rounded-lg bg-card">
        <div className="flex flex-col items-center justify-center h-64">
          <SettingsIcon className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Settings & Preferences</h3>
          <p className="max-w-md mt-2 text-muted-foreground">
            Customize your experience, manage notifications, and update account information.
          </p>
        </div>
      </div>
    </div>
  );
}

// Habit Dashboard Component
function HabitDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openModal}
          className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white rounded-md bg-primary md:mt-0"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Habit
        </motion.button>
      </div>

      <HabitOverview />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HabitList />
        </div>
        
        <div className="lg:col-span-1">
          <DailyCheckIn />
        </div>
      </div>

      {isModalOpen && <NewHabitModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <HabitDashboard />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <HabitDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300",
            sidebarOpen ? "md:ml-64" : "ml-0"
          )}
        >
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Main App Component
export default function PersonalAnalyticsHabitTracker() {
  return (
    <ThemeProvider>
      <HabitProvider>
        <Dashboard />
      </HabitProvider>
    </ThemeProvider>
  );
}
