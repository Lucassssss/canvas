import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { users, teams, roles } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "joii_berry_jwt_super_secret_for_dev_only";

// Use an in-memory dictionary for verification codes
const mockCodes: Record<string, string> = {};

// POST /api/auth/send-code
router.post("/send-code", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone number is required." });
    }
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    mockCodes[phone] = pin;
    console.log(`\n[SMS MOCK] 验证码发送至 ${phone} -> 您的动态验证码是: ${pin} (5分钟内有效)\n`);
    res.json({ success: true, message: "验证码已发送至手机（查看后端终端）" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { phone, code, password } = req.body;
    if (!phone || !code || !password) {
      return res.status(400).json({ success: false, error: "Phone, code, and password are required." });
    }
    if (mockCodes[phone] !== code) {
      return res.status(400).json({ success: false, error: "验证码不正确或已过期" });
    }
    delete mockCodes[phone];

    // Transactional logic: Create Team -> Role -> User
    await db.transaction(async (tx) => {
      const existing = await tx.query.users.findFirst({ where: eq(users.phone, phone) });
      if (existing) {
        throw new Error("该手机号已被注册");
      }

      // 1. Create independent SaaS Tenant (Team)
      const newTeam = await tx.insert(teams).values({
        name: `团队_${phone.slice(-4)}`
      }).returning();
      const teamId = newTeam[0].id;

      // 2. Create the System Roles for this Team
      const bossRole = await tx.insert(roles).values({
        teamId: teamId,
        name: "超级管理员 (Boss)",
        type: "system",
        permissions: { "all": true }
      }).returning();

      await tx.insert(roles).values({
        teamId: teamId,
        name: "主管 (Manager)",
        type: "system"
      });
      await tx.insert(roles).values({
        teamId: teamId,
        name: "普通员工 (Employee)",
        type: "system"
      });

      // 3. Create the Main User tied to the Team and Role
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUsername = `user_${phone}`;
      const newName = `Founder_${phone.slice(-4)}`;

      const newUser = await tx.insert(users).values({
        teamId: teamId,
        roleId: bossRole[0].id,
        phone: phone,
        username: newUsername,
        name: newName,
        passwordHash: passwordHash,
      }).returning();

      // Sign Token
      const token = jwt.sign({ id: newUser[0].id, roleId: newUser[0].roleId, teamId: teamId }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        success: true, 
        message: "注册成功", 
        data: {
          token,
          user: { id: newUser[0].id, phone: newUser[0].phone, username: newUser[0].username, name: newUser[0].name, teamId }
        } 
      });
    });

  } catch (error: any) {
    if (error.message === "该手机号已被注册") {
       return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { type, password, account, phone, code } = req.body;
    let user;

    if (type === "account-pwd") {
      if (!account || !password) return res.status(400).json({ success: false, error: "请输入账号和密码" });
      user = await db.query.users.findFirst({ where: eq(users.username, account) });
      if (!user) return res.status(401).json({ success: false, error: "账号或密码错误" });
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, error: "账号或密码错误" });
    } else if (type === "phone-pwd") {
      if (!phone || !password) return res.status(400).json({ success: false, error: "请输入手机号和密码" });
      user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
      if (!user) return res.status(401).json({ success: false, error: "手机号或密码错误" });
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, error: "手机号或密码错误" });
    } else if (type === "phone-code") {
      if (!phone || !code) return res.status(400).json({ success: false, error: "请输入手机号和验证码" });
      if (mockCodes[phone] !== code) return res.status(401).json({ success: false, error: "验证码不正确或已过期" });
      user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
      if (!user) return res.status(401).json({ success: false, error: "该手机号尚未注册" });
      delete mockCodes[phone];
    } else {
      return res.status(400).json({ success: false, error: "暂不支持的登录类型" });
    }

    if (user.status !== "active") return res.status(403).json({ success: false, error: "该账号已被禁用" });

    // Generate JWT including teamId
    const token = jwt.sign({ id: user.id, roleId: user.roleId, teamId: user.teamId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      message: "登录成功", 
      data: {
        token,
        user: { id: user.id, phone: user.phone, username: user.username, name: user.name, teamId: user.teamId }
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me (Protected Route now uses middleware)
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id)
    });

    if (!user) return res.status(404).json({ success: false, error: "用户信息不存在" });

    res.json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        roleId: user.roleId,
        teamId: user.teamId,
        browserLimit: user.browserLimit,
        accessibleGroups: user.accessibleGroups,
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const authRouter = router;
