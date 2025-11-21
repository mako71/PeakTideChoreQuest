import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./auth-context";

interface QuestsContextType {
  tasks: any[];
  loading: boolean;
  addQuest: (quest: any) => Promise<void>;
  updateQuest: (id: number, updates: any) => Promise<void>;
  deleteQuest: (id: number) => Promise<void>;
  completeQuest: (id: number) => Promise<void>;
  claimQuest: (id: number) => Promise<void>;
}

const QuestsContext = createContext<QuestsContextType | undefined>(undefined);

export function QuestsProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchQuests = async () => {
    if (!user?.householdId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/households/${user.householdId}/quests`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch quests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [user?.householdId]);

  const addQuest = async (quest: any) => {
    if (!user?.householdId) return;

    try {
      const res = await fetch(`/api/households/${user.householdId}/quests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quest),
      });

      if (res.ok) {
        const newQuest = await res.json();
        setTasks([...tasks, newQuest]);
      }
    } catch (error) {
      console.error("Failed to add quest", error);
      throw error;
    }
  };

  const updateQuest = async (id: number, updates: any) => {
    try {
      const res = await fetch(`/api/quests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updatedQuest = await res.json();
        setTasks(tasks.map(t => t.id === id ? updatedQuest : t));
      }
    } catch (error) {
      console.error("Failed to update quest", error);
      throw error;
    }
  };

  const deleteQuest = async (id: number) => {
    try {
      await fetch(`/api/quests/${id}`, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete quest", error);
      throw error;
    }
  };

  const completeQuest = async (id: number) => {
    await updateQuest(id, { status: "completed" });
  };

  const claimQuest = async (id: number) => {
    await updateQuest(id, { status: "in-progress" });
  };

  const value = {
    tasks,
    loading,
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
