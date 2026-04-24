import { Router } from "express";
import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { users, roles, accessPolicies, loginSettings } from "../db/schema.js";
import bcrypt from "bcryptjs";

export const teamRouter = Router();

// ========================
// Users (Members) Management
// ========================

teamRouter.get("/members", async (req, res) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      roleId: users.roleId,
      name: users.name,
      username: users.username,
      phone: users.phone,
      accessibleGroups: users.accessibleGroups,
      browserLimit: users.browserLimit,
      status: users.status,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.teamId, req.user!.teamId));
    res.json({ success: true, data: allUsers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.post("/members", async (req, res) => {
  try {
    const { name, username, phone, password, roleId, accessibleGroups, browserLimit } = req.body;
    
    // Minimal validation
    if (!name || !username || !password) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Check if username already exists globally (since username is strictly unique across the system in schema)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "该用户名已被使用" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const inserted = await db.insert(users).values({
      teamId: req.user!.teamId,
      name,
      username,
      phone,
      passwordHash,
      roleId,
      accessibleGroups: accessibleGroups || "[]",
      browserLimit: browserLimit || 0
    }).returning({
      id: users.id,
      username: users.username
    });
    
    res.json({ success: true, data: inserted[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.put("/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password, username, ...updateData } = req.body;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    if (username) {
      const existingUser = await db.query.users.findFirst({
         where: eq(users.username, username)
      });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ success: false, error: "该用户名已被其他人使用" });
      }
      updateData.username = username;
    }
    
      // Security Check: Make sure the user belongs to the same team!
    const targetUser = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.teamId, req.user!.teamId))
    });
    if (!targetUser) return res.status(404).json({ success: false, error: "User not found or unauthorized" });

    const updated = await db.update(users)
      .set(updateData)
      .where(and(eq(users.id, id), eq(users.teamId, req.user!.teamId)))
      .returning({ id: users.id });
      
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
    const allRoles = await db.select()
      .from(roles)
      .where(eq(roles.teamId, req.user!.teamId));
    res.json({ success: true, data: allRoles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

teamRouter.post("/roles", async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const inserted = await db.insert(roles).values({
      teamId: req.user!.teamId,
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
