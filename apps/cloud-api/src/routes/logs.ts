import { Router } from "express";
import { db } from "../db/index.js";
import { accessLogs } from "../db/schema.js";

export const logsRouter = Router();

logsRouter.get("/", async (req, res) => {
  try {
    const logs = await db.select().from(accessLogs).orderBy(accessLogs.createdAt);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
