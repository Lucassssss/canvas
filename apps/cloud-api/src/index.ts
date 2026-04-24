import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rootRouter } from "./routes/index.js";
import { environmentRouter } from "./routes/environments.js";
import { deviceRouter } from "./routes/devices.js";
import { groupsRouter } from "./routes/groups.js";
import { teamRouter } from "./routes/team.js";
import { logsRouter } from "./routes/logs.js";
import { rpaRouter } from "./routes/rpa.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

// 注册路由
app.use("/api", rootRouter);
app.use("/api/environments", requireAuth, environmentRouter);
app.use("/api/devices", requireAuth, deviceRouter);
app.use("/api/groups", requireAuth, groupsRouter);
app.use("/api/auth", authRouter);
app.use("/api/team", requireAuth, teamRouter);
app.use("/api/logs", requireAuth, logsRouter);
app.use("/api/rpa", requireAuth, rpaRouter);

// 全局错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`============================================`);
  console.log(`☁️  Joii Berry Cloud API 启动成功`);
  console.log(`📡 监听端口: http://localhost:${PORT}`);
  console.log(`============================================`);
});
