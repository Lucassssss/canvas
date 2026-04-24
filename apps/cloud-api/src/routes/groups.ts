import { Router } from "express";
import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { groups } from "../db/schema.js";

export const groupsRouter = Router();

groupsRouter.get("/", async (req, res) => {
  try {
    const allGroups = await db.select().from(groups)
      .where(eq(groups.teamId, req.user!.teamId))
      .orderBy(groups.createdAt);
    
    // TODO: Join with browser_environments to get 'count' dynamically 
    
    res.json({ success: true, data: allGroups });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

groupsRouter.post("/", async (req, res) => {
  try {
    const { name, desc } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    const inserted = await db.insert(groups).values({
      teamId: req.user!.teamId,
      name,
      desc
    }).returning();
    
    res.json({ success: true, data: inserted[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

groupsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc } = req.body;
    
    const updated = await db.update(groups)
      .set({ name, desc })
      .where(and(eq(groups.id, id), eq(groups.teamId, req.user!.teamId)))
      .returning();
      
    res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

groupsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(groups).where(and(eq(groups.id, id), eq(groups.teamId, req.user!.teamId)));
    res.json({ success: true, message: "Group deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
