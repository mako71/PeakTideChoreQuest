import { createContext, useContext, useState, ReactNode } from "react";
import { USERS } from "./data";
import { useQuests } from "./quests-context";

interface MembersContextType {
  members: any[];
  removeMember: (userId: number) => void;
  addMember: (member: any) => void;
  updateMemberRole: (userId: number, role: "member" | "manager") => void;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState(USERS);
  const { tasks, updateQuest } = useQuests();

  const removeMember = (userId: number) => {
    setMembers(members.filter(m => m.id !== userId));
    
    // Remove member assignments from all quests
    tasks.forEach(task => {
      if (task.assignee === userId) {
        updateQuest({ ...task, assignee: null });
      }
    });
  };

  const addMember = (member: any) => {
    const newMember = {
      ...member,
      id: Math.max(...members.map(m => m.id), 0) + 1,
      xp: member.xp || 0,
      level: member.level || 1,
      rank: members.length + 1,
      streak: member.streak || 0,
      role: member.role || "member",
    };
    setMembers([...members, newMember]);
  };

  const updateMemberRole = (userId: number, role: "member" | "manager") => {
    setMembers(members.map(m => m.id === userId ? { ...m, role } : m));
  };

  const value = {
    members,
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
