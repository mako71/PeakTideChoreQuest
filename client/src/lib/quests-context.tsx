import { createContext, useContext, useState, ReactNode } from "react";
import { TASKS } from "./data";

interface QuestsContextType {
  tasks: any[];
  addQuest: (quest: any) => void;
  updateQuest: (updatedQuest: any) => void;
  deleteQuest: (id: number) => void;
  completeQuest: (id: number) => void;
  claimQuest: (id: number) => void;
}

const QuestsContext = createContext<QuestsContextType | undefined>(undefined);

export function QuestsProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState(TASKS);

  const addQuest = (quest: any) => {
    setTasks([...tasks, quest]);
  };

  const updateQuest = (updatedQuest: any) => {
    setTasks(tasks.map(t => t.id === updatedQuest.id ? updatedQuest : t));
  };

  const deleteQuest = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completeQuest = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const claimQuest = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, assignee: 1 } : t));
  };

  const value = {
    tasks,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    claimQuest,
  };

  return (
    <QuestsContext.Provider value={value}>
      {children}
    </QuestsContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestsContext);
  if (!context) {
    throw new Error("useQuests must be used within QuestsProvider");
  }
  return context;
}
