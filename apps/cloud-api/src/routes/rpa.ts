import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { rpaScripts } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

const router = Router();

// Get all RPA scripts
router.get("/", async (req: Request, res: Response) => {
  try {
    const scripts = await db.select().from(rpaScripts)
      .where(eq(rpaScripts.teamId, req.user!.teamId))
      .orderBy(rpaScripts.createdAt);
    res.json({ success: true, data: scripts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a specific RPA script
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const script = await db.query.rpaScripts.findFirst({
      where: and(eq(rpaScripts.id, req.params.id), eq(rpaScripts.teamId, req.user!.teamId))
    });
    if (!script) {
      return res.status(404).json({ success: false, error: "Script not found" });
    }
    res.json({ success: true, data: script });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new RPA script
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, groupId } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "Name is required" });

    // Ensure empty arrays are stored securely as stringified JSON if passed directly,
    // although drizzle jsonb understands arrays directly depending on config.
    const newScript = await db.insert(rpaScripts).values({
      teamId: req.user!.teamId,
      name,
      groupId: groupId || null,
      nodes: "[]",
      edges: "[]",
    }).returning();

    res.json({ success: true, data: newScript[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update an RPA script (e.g., saving canvas state)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, groupId, nodes, edges } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (groupId !== undefined) updateData.groupId = groupId;
    
    // We expect nodes and edges to be JSON strings from frontend, or objects depending on body parser
    if (nodes !== undefined) updateData.nodes = typeof nodes === 'string' ? nodes : JSON.stringify(nodes);
    if (edges !== undefined) updateData.edges = typeof edges === 'string' ? edges : JSON.stringify(edges);

    const updated = await db.update(rpaScripts)
      .set(updateData)
      .where(and(eq(rpaScripts.id, id), eq(rpaScripts.teamId, req.user!.teamId)))
      .returning();

    res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an RPA script
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(rpaScripts).where(and(eq(rpaScripts.id, id), eq(rpaScripts.teamId, req.user!.teamId)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const rpaRouter = router;
