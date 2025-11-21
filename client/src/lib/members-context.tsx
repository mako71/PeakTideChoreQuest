import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./auth-context";

interface MembersContextType {
  members: any[];
  loading: boolean;
  removeMember: (id: number) => Promise<void>;
  addMember: (member: any) => Promise<void>;
  updateMemberRole: (id: number, role: "member" | "manager") => Promise<void>;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!user?.householdId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/households/${user.householdId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user?.householdId]);

  const removeMember = async (id: number) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove member", error);
      throw error;
    }
  };

  const addMember = async (member: any) => {
    if (!user?.householdId) return;

    try {
      const res = await fetch(`/api/households/${user.householdId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });

      if (res.ok) {
        const newMember = await res.json();
        setMembers([...members, newMember]);
      }
    } catch (error) {
      console.error("Failed to add member", error);
      throw error;
    }
  };

  const updateMemberRole = async (id: number, role: "member" | "manager") => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        const updatedMember = await res.json();
        setMembers(members.map(m => m.id === id ? updatedMember : m));
      }
    } catch (error) {
      console.error("Failed to update member role", error);
      throw error;
    }
  };

  const value = {
    members,
    loading,
    removeMember,
    addMember,
    updateMemberRole,
  };

  return (
    <MembersContext.Provider value={value}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error("useMembers must be used within MembersProvider");
  }
  return context;
}
