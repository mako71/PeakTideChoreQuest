import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Household,
  type InsertHousehold,
  type Member,
  type InsertMember,
  type Quest,
  type InsertQuest,
  type UpdateQuest,
  users,
  households,
  members,
  quests,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser, householdId?: string): Promise<User>;
  updateUserHousehold(userId: string, householdId: string): Promise<void>;

  // Households
  createHousehold(household: InsertHousehold, creatorId: string): Promise<Household>;
  getHousehold(id: string): Promise<Household | undefined>;
  getHouseholdByUserId(userId: string): Promise<Household | undefined>;

  // Members
  addMember(member: InsertMember): Promise<Member>;
  getMembersByHousehold(householdId: string): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByUserId(householdId: string, userId: string): Promise<Member | undefined>;
  updateMember(id: number, updates: Partial<Member>): Promise<Member>;
  removeMember(id: number): Promise<void>;

  // Quests
  createQuest(quest: InsertQuest): Promise<Quest>;
  getQuestsByHousehold(householdId: string): Promise<Quest[]>;
  getQuest(id: number): Promise<Quest | undefined>;
  updateQuest(id: number, updates: Partial<Quest>): Promise<Quest>;
  deleteQuest(id: number): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(user: InsertUser, householdId?: string): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        ...user,
        householdId,
      })
      .returning();
    return result[0];
  }

  async updateUserHousehold(userId: string, householdId: string): Promise<void> {
    await db.update(users).set({ householdId }).where(eq(users.id, userId));
  }

  // Households
  async createHousehold(household: InsertHousehold, creatorId: string): Promise<Household> {
    const result = await db.insert(households).values(household).returning();
    const newHousehold = result[0];

    // Update creator's household
    await this.updateUserHousehold(creatorId, newHousehold.id);

    return newHousehold;
  }

  async getHousehold(id: string): Promise<Household | undefined> {
    const result = await db
      .select()
      .from(households)
      .where(eq(households.id, id))
      .limit(1);
    return result[0];
  }

  async getHouseholdByUserId(userId: string): Promise<Household | undefined> {
    const user = await this.getUser(userId);
    if (!user?.householdId) return undefined;
    return this.getHousehold(user.householdId);
  }

  // Members
  async addMember(member: InsertMember): Promise<Member> {
    const result = await db.insert(members).values(member).returning();
    return result[0];
  }

  async getMembersByHousehold(householdId: string): Promise<Member[]> {
    return db.select().from(members).where(eq(members.householdId, householdId));
  }

  async getMember(id: number): Promise<Member | undefined> {
    const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
    return result[0];
  }

  async getMemberByUserId(householdId: string, userId: string): Promise<Member | undefined> {
    const result = await db
      .select()
      .from(members)
      .where(and(eq(members.householdId, householdId), eq(members.userId, userId)))
      .limit(1);
    return result[0];
  }

  async updateMember(id: number, updates: Partial<Member>): Promise<Member> {
    const result = await db.update(members).set(updates).where(eq(members.id, id)).returning();
    return result[0];
  }

  async removeMember(id: number): Promise<void> {
    // Clear quest assignments for this member
    await db.update(quests).set({ assigneeId: null }).where(eq(quests.assigneeId, id));
    // Remove member
    await db.delete(members).where(eq(members.id, id));
  }

  // Quests
  async createQuest(quest: InsertQuest): Promise<Quest> {
    const result = await db.insert(quests).values(quest).returning();
    return result[0];
  }

  async getQuestsByHousehold(householdId: string): Promise<Quest[]> {
    return db.select().from(quests).where(eq(quests.householdId, householdId));
  }

  async getQuest(id: number): Promise<Quest | undefined> {
    const result = await db.select().from(quests).where(eq(quests.id, id)).limit(1);
    return result[0];
  }

  async updateQuest(id: number, updates: Partial<Quest>): Promise<Quest> {
    const result = await db.update(quests).set(updates).where(eq(quests.id, id)).returning();
    return result[0];
  }

  async deleteQuest(id: number): Promise<void> {
    await db.delete(quests).where(eq(quests.id, id));
  }
}

export const storage = new PostgresStorage();
