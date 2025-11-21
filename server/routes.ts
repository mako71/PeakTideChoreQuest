import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertHouseholdSchema, insertMemberSchema, insertQuestSchema, updateQuestSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });

      req.session!.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session!.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session!.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: { id: user.id, username: user.username, householdId: user.householdId } });
  });

  // Household routes
  app.post("/api/households", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { name } = insertHouseholdSchema.parse(req.body);
      const household = await storage.createHousehold({ name }, req.session.userId);

      // Add creator as manager
      await storage.addMember({
        householdId: household.id,
        userId: req.session.userId,
        name: req.session.userId.substring(0, 4),
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
        title: "Household Owner",
        role: "manager",
      });

      res.json(household);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/households/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const household = await storage.getHousehold(req.params.id);
    if (!household) {
      return res.status(404).json({ error: "Household not found" });
    }

    res.json(household);
  });

  app.get("/api/households/:id/members", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const members = await storage.getMembersByHousehold(req.params.id);
    res.json(members);
  });

  app.post("/api/households/:id/members", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const member = await storage.addMember({
        householdId: req.params.id,
        ...insertMemberSchema.parse(req.body),
      });
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const member = await storage.updateMember(parseInt(req.params.id), req.body);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.removeMember(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Quest routes
  app.post("/api/households/:id/quests", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const quest = await storage.createQuest({
        householdId: req.params.id,
        ...insertQuestSchema.parse(req.body),
      });
      res.json(quest);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/households/:id/quests", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const quests = await storage.getQuestsByHousehold(req.params.id);
    res.json(quests);
  });

  app.patch("/api/quests/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const quest = await storage.updateQuest(parseInt(req.params.id), updateQuestSchema.parse({ id: parseInt(req.params.id), ...req.body }));
      res.json(quest);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/quests/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.deleteQuest(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
