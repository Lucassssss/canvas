import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "joii_berry_jwt_super_secret_for_dev_only";

// Extend Express Request interface to include the user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roleId: string | null;
        teamId: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "未提供认证 Token" });
    }

    const token = authHeader.split(" ")[1];
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: "Token 失效或过期" });
    }

    if (!decoded.id || !decoded.teamId) {
      return res.status(401).json({ success: false, error: "无效的 Token 载荷" });
    }

    // Verify user still exists and is active
    const userRow = await db.query.users.findFirst({
      where: eq(users.id, decoded.id)
    });

    if (!userRow) {
      return res.status(401).json({ success: false, error: "Token 对应的用户不存在" });
    }

    if (userRow.status !== "active") {
      return res.status(403).json({ success: false, error: "该账号已被禁用" });
    }

    if (userRow.teamId !== decoded.teamId) {
      return res.status(403).json({ success: false, error: "团队归属权异常错乱" });
    }

    // Attach to request
    req.user = {
      id: userRow.id,
      roleId: userRow.roleId,
      teamId: userRow.teamId,
    };

    next();

  } catch (error: any) {
    res.status(500).json({ success: false, error: "认证系统内部错误" });
  }
};
