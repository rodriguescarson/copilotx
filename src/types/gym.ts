export type FitnessGoal = "fat_loss" | "muscle_gain" | "endurance" | string;
export type DietPreference = "vegetarian" | "vegan" | "non_vegetarian" | string;

export type CalorieMode = "deficit" | "surplus" | "maintenance";

export interface GymState {
  goal: FitnessGoal;
  schedule: Record<string, number>;
  workoutPlan: WorkoutDay[];
  dietPref: DietPreference;
  calories: number;
  calorieMode: CalorieMode;
  sleepHours?: number;
  lastDietPlan?: Meal[];
  lastSleepTips?: SleepTip[];
}

export interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  muscleGroup?: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  duration: number;
  focus?: string;
  exercises: (WorkoutExercise | string)[];
}

export type WorkoutPlan = WorkoutDay[];

export interface Meal {
  name: string;
  calories: number;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  dietType?: "vegetarian" | "vegan" | "non_vegetarian";
  protein?: number;
  carbs?: number;
  fat?: number;
  description?: string;
  ingredients?: string[];
}

export interface SleepTip {
  category: string;
  tip: string;
  source?: string;
}
