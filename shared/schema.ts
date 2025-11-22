import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  householdId: varchar("household_id"),
});

// Households - groups of users collaborating together
export const households = pgTable("households", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: varchar("created_at").default(sql`now()`),
});

// Members within a household
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  householdId: varchar("household_id").notNull(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  title: text("title").notNull().default("Adventurer"),
  role: text("role").notNull().default("member"), // 'member' or 'manager'
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
});

// Quests/Tasks within a household
export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  householdId: varchar("household_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  xp: integer("xp").notNull().default(100),
  difficulty: integer("difficulty").notNull().default(2), // 1-5
  type: text("type").notNull().default("mountain"), // 'mountain' or 'ocean'
  status: text("status").notNull().default("open"), // 'open', 'in-progress', 'completed'
  assigneeId: integer("assignee_id"),
  steps: json("steps").default([]), // array of step strings
  dueDate: timestamp("due_date"),
});

// Notifications for falling-behind quests
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  householdId: varchar("household_id").notNull(),
  questId: integer("quest_id").notNull(),
  memberId: integer("member_id"),
  type: text("type").notNull().default("falling_behind"), // 'falling_behind', 'overdue'
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHouseholdSchema = createInsertSchema(households).pick({
  name: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
});

export const updateQuestSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  xp: z.number().optional(),
  difficulty: z.number().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  assigneeId: z.number().optional().nullable(),
  steps: z.array(z.string()).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Household = typeof households.$inferSelect;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type UpdateQuest = z.infer<typeof updateQuestSchema>;
