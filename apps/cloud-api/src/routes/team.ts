import { Router } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users, roles, accessPolicies, loginSettings } from "../db/schema.js";

export const teamRouter = Router();

// ========================
// Users (Members) Management
// ========================

teamRouter.get("/members", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ success: true, data: allUsers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.post("/members", async (req, res) => {
  try {
    const { name, username, phone, passwordHash, roleId, accessibleGroups, browserLimit } = req.body;
    
    // Minimal validation
    if (!name || !username || !passwordHash) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const inserted = await db.insert(users).values({
      name,
      username,
      phone,
      passwordHash, // In real world, hash on insertion
      roleId,
      accessibleGroups,
      browserLimit: browserLimit || 0
    }).returning();
    
    res.json({ success: true, data: inserted[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.put("/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updated = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
      
    res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.delete("/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, id));
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================
// Roles Management
// ========================

teamRouter.get("/roles", async (req, res) => {
  try {
    const allRoles = await db.select().from(roles);
    res.json({ success: true, data: allRoles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.post("/roles", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const inserted = await db.insert(roles).values({
      name,
      type: "custom",
      permissions: permissions || "{}"
    }).returning();
    
    res.json({ success: true, data: inserted[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.delete("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(roles).where(eq(roles.id, id));
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// Access Policies
// ========================

teamRouter.get("/policies", async (req, res) => {
  try {
    const policies = await db.select().from(accessPolicies);
    res.json({ success: true, data: policies });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.post("/policies", async (req, res) => {
  try {
    const { name, type, targets, appliedTo } = req.body;
    const inserted = await db.insert(accessPolicies).values({
      name, type, targets, appliedTo
    }).returning();
    res.json({ success: true, data: inserted[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================
// Login Settings
// ========================

teamRouter.get("/login-settings", async (req, res) => {
  try {
    const settings = await db.select().from(loginSettings);
    let config = settings[0];
    if (!config) {
      // Lazy init singletom
      const inserted = await db.insert(loginSettings).values({ id: 'singleton' }).returning();
      config = inserted[0];
    }
    res.json({ success: true, data: config });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.put("/login-settings", async (req, res) => {
  try {
    const data = req.body;
    // ensure singleton exists
    let settings = await db.select().from(loginSettings);
    if (!settings[0]) {
      await db.insert(loginSettings).values({ id: 'singleton' });
    }
    
    // Filter undefined keys
    const updateData: any = {};
    if (data.deviceWhitelist !== undefined) updateData.deviceWhitelist = data.deviceWhitelist;
    if (data.officeIpRestricted !== undefined) updateData.officeIpRestricted = data.officeIpRestricted;
    if (data.allowedIps !== undefined) updateData.allowedIps = data.allowedIps;
    if (data.timeRestricted !== undefined) updateData.timeRestricted = data.timeRestricted;
    if (data.allowTimeStart !== undefined) updateData.allowTimeStart = data.allowTimeStart;
    if (data.allowTimeEnd !== undefined) updateData.allowTimeEnd = data.allowTimeEnd;

    const updated = await db.update(loginSettings)
      .set(updateData)
      .where(eq(loginSettings.id, 'singleton'))
      .returning();
      
    res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
