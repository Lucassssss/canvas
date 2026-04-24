import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "joii_berry_jwt_super_secret_for_dev_only";

// Use an in-memory dictionary for verification codes (for demo purposes only)
const mockCodes: Record<string, string> = {};

// POST /api/auth/send-code - Send verification code
router.post("/send-code", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone number is required." });
    }

    // Generate 6 digit pin
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    mockCodes[phone] = pin;

    // Simulate sending SMS by logging it to the backend console
    console.log(`\n[SMS MOCK] 验证码发送至 ${phone} -> 您的动态验证码是: ${pin} (5分钟内有效)\n`);

    res.json({ success: true, message: "验证码已发送至手机（查看后端终端）" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/register - Register via Phone and verify Code
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { phone, code, password } = req.body;
    if (!phone || !code || !password) {
      return res.status(400).json({ success: false, error: "Phone, code, and password are required." });
    }

    // Verify Code
    if (mockCodes[phone] !== code) {
      return res.status(400).json({ success: false, error: "验证码不正确或已过期" });
    }

    // Clear code after use
    delete mockCodes[phone];

    // Check if phone or default username exists
    const existing = await db.query.users.findFirst({
      where: eq(users.phone, phone)
    });
    if (existing) {
      return res.status(400).json({ success: false, error: "该手机号已被注册" });
    }

    // Create the hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default values for standard user registration (The primary owner)
    const newUsername = `user_${phone}`;
    const newName = `Founder_${phone.slice(-4)}`;

    const newUser = await db.insert(users).values({
      phone: phone,
      username: newUsername,
      name: newName,
      passwordHash: passwordHash,
      // Default to no role or perhaps an admin role if available
    }).returning();

    // Auto login: Generate JWT
    const token = jwt.sign({ id: newUser[0].id, roleId: newUser[0].roleId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      message: "注册成功", 
      data: {
        token,
        user: {
          id: newUser[0].id,
          phone: newUser[0].phone,
          username: newUser[0].username,
          name: newUser[0].name
        }
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login - Universal Login handling both Account and Phone mechanisms
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { type, password, account, phone, code } = req.body;

    let user;

    if (type === "account-pwd") {
      // 1. Account + Password (For team members, sub-accounts, or founders who remember their username)
      if (!account || !password) return res.status(400).json({ success: false, error: "请输入账号和密码" });
      user = await db.query.users.findFirst({ where: eq(users.username, account) });
      
      if (!user) return res.status(401).json({ success: false, error: "账号或密码错误" });
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, error: "账号或密码错误" });

    } else if (type === "phone-pwd") {
      // 2. Phone + Password (For founders primarily)
      if (!phone || !password) return res.status(400).json({ success: false, error: "请输入手机号和密码" });
      user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
      
      if (!user) return res.status(401).json({ success: false, error: "手机号或密码错误" });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, error: "手机号或密码错误" });

    } else if (type === "phone-code") {
      // 3. Phone + Code (For simple login without password)
      if (!phone || !code) return res.status(400).json({ success: false, error: "请输入手机号和验证码" });
      if (mockCodes[phone] !== code) {
        return res.status(401).json({ success: false, error: "验证码不正确或已过期" });
      }
      user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
      if (!user) return res.status(401).json({ success: false, error: "该手机号尚未注册" });

      // Clear code
      delete mockCodes[phone];
    } else {
      return res.status(400).json({ success: false, error: "暂不支持的登录类型" });
    }

    // Checking status
    if (user.status !== "active") {
      return res.status(403).json({ success: false, error: "该账号已被禁用" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, roleId: user.roleId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      message: "登录成功", 
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          name: user.name
        }
      } 
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me - Validate token and return profile
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "未提供认证 Token" });
    }

    const token = authHeader.split(" ")[1];
    
    // Using simple try/catch for jwt checking
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string, roleId: string | null };
    } catch (err) {
      return res.status(401).json({ success: false, error: "Token 失效或过期" });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id)
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "用户信息不存在" });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        roleId: user.roleId,
        browserLimit: user.browserLimit,
        accessibleGroups: user.accessibleGroups,
        createdAt: user.createdAt
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const authRouter = router;
