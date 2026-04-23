import { Router } from "express";

export const rootRouter = Router();

import { ApiResponse } from "../utils/response.js";

// 健康检查接口
rootRouter.get("/health", (req, res) => {
  return ApiResponse.success(res, null, "Cloud API is running gracefully.");
});

// 挂载浏览器环境相关的路由
import { environmentRouter } from "./environments.js";
rootRouter.use("/environments", environmentRouter);
