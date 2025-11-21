import { CheckCircle2, Mountain, Waves, Trophy, Flame, Zap } from "lucide-react";

export const USERS = [
  {
    id: 1,
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
    xp: 2450,
    level: 12,
    rank: 1,
    streak: 5,
    title: "Summit Seeker",
    role: "manager"
  },
  {
    id: 2,
    name: "Sam",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
    xp: 2100,
    level: 10,
    rank: 2,
    streak: 12,
    title: "Wave Rider",
    role: "member"
  },
  {
    id: 3,
    name: "Jordan",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100",
    xp: 1850,
    level: 8,
    rank: 3,
    streak: 2,
    title: "Trail Blazer",
    role: "member"
  }
];

export const TASKS = [
  {
    id: 1,
    title: "Conquer the Dish Mountain",
    description: "Load the dishwasher and scrub the pots. Don't let the grime win.",
    xp: 150,
    difficulty: 3, // 1-5
    type: "mountain", // mountain or ocean
    assignee: null,
    status: "open", // open, in-progress, completed
    steps: [
      "Clear the sink basin",
      "Rinse heavy debris",
      "Load bottom rack (Tetris style)",
      "Load top rack",
      "Start cycle"
    ]
  },
  {
    id: 2,
    title: "Tame the Dust Bunnies",
    description: "Vacuum the living room and hallway. They are multiplying.",
    xp: 100,
    difficulty: 2,
    type: "mountain",
    assignee: 2,
    status: "in-progress",
    steps: []
  },
  {
    id: 3,
    title: "Laundry Expedition",
    description: "Sort, wash, and fold. A three-stage journey.",
    xp: 300,
    difficulty: 5,
    type: "ocean",
    assignee: 1,
    status: "open",
    steps: [
      "Sort lights and darks",
      "Start wash cycle",
      "Transfer to dryer",
      "Fold and put away"
    ]
  },
  {
    id: 4,
    title: "Hydration Station Refill",
    description: "Clean and refill all water bottles and the pet bowl.",
    xp: 50,
    difficulty: 1,
    type: "ocean",
    assignee: null,
    status: "completed",
    steps: []
  },
  {
    id: 5,
    title: "Gear Maintenance",
    description: "Organize the entry way and put away shoes/coats.",
    xp: 120,
    difficulty: 2,
    type: "mountain",
    assignee: 3,
    status: "open",
    steps: []
  }
];

export const ACHIEVEMENTS = [
  { id: 1, title: "Early Bird", icon: Zap, description: "Complete a task before 8am" },
  { id: 2, title: "Streak Master", icon: Flame, description: "7 day streak maintained" },
  { id: 3, title: "Heavy Lifter", icon: Mountain, description: "Complete 5 high difficulty tasks" },
];
