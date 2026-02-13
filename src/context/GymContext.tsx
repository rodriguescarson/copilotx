"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useCopilotReadable } from "@copilotkit/react-core";
import type { GymState, FitnessGoal, DietPreference, WorkoutDay, CalorieMode, Meal, SleepTip } from "@/types/gym";

const defaultState: GymState = {
  goal: "",
  schedule: {},
  workoutPlan: [],
  dietPref: "non_vegetarian",
  calories: 2000,
  calorieMode: "maintenance",
  sleepHours: 7,
};

interface GymContextValue {
  state: GymState;
  setGoal: (goal: FitnessGoal) => void;
  setSchedule: (schedule: Record<string, number>) => void;
  setWorkoutPlan: (plan: WorkoutDay[]) => void;
  setDietPref: (pref: DietPreference) => void;
  setCalories: (calories: number) => void;
  setCalorieMode: (mode: CalorieMode) => void;
  setSleepHours: (hours: number) => void;
  setLastDietPlan: (meals: Meal[]) => void;
  setLastSleepTips: (tips: SleepTip[]) => void;
  setState: (updates: Partial<GymState>) => void;
}

const GymContext = createContext<GymContextValue | null>(null);

export function GymProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<GymState>(defaultState);

  const setState = useCallback((updates: Partial<GymState>) => {
    setStateInternal((prev) => ({ ...prev, ...updates }));
  }, []);

  const setGoal = useCallback((goal: FitnessGoal) => {
    setStateInternal((prev) => ({ ...prev, goal }));
  }, []);

  const setSchedule = useCallback((schedule: Record<string, number>) => {
    setStateInternal((prev) => ({ ...prev, schedule }));
  }, []);

  const setWorkoutPlan = useCallback((workoutPlan: WorkoutDay[]) => {
    setStateInternal((prev) => ({ ...prev, workoutPlan }));
  }, []);

  const setDietPref = useCallback((pref: DietPreference) => {
    setStateInternal((prev) => ({ ...prev, dietPref: pref }));
  }, []);

  const setCalories = useCallback((calories: number) => {
    setStateInternal((prev) => ({ ...prev, calories }));
  }, []);

  const setCalorieMode = useCallback((calorieMode: CalorieMode) => {
    setStateInternal((prev) => ({ ...prev, calorieMode }));
  }, []);

  const setLastDietPlan = useCallback((lastDietPlan: Meal[]) => {
    setStateInternal((prev) => ({ ...prev, lastDietPlan }));
  }, []);

  const setLastSleepTips = useCallback((lastSleepTips: SleepTip[]) => {
    setStateInternal((prev) => ({ ...prev, lastSleepTips }));
  }, []);

  const setSleepHours = useCallback((hours: number) => {
    setStateInternal((prev) => ({ ...prev, sleepHours: hours }));
  }, []);

  useCopilotReadable({
    description:
      "Current plan state: goal, workoutPlan (days with exercises), lastDietPlan (meals), lastSleepTips. dietPref, calories, calorieMode, sleepHours. When user says 'add to my plan' or 'update my plan', use saveFullPlan with the FULL merged plan (existing + new).",
    value: state,
  });

  return (
    <GymContext.Provider
      value={{
        state,
        setGoal,
        setSchedule,
        setWorkoutPlan,
        setDietPref,
        setCalories,
        setCalorieMode,
        setSleepHours,
        setLastDietPlan,
        setLastSleepTips,
        setState,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error("useGym must be used within GymProvider");
  return ctx;
}
