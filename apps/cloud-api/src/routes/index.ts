import { Router } from "express";

export const rootRouter = Router();

import { ApiResponse } from "../utils/response.js";

// 健康检查接口
rootRouter.get("/health", (req, res) => {
  return ApiResponse.success(res, null, "Cloud API is running gracefully.");
});

// rootRouter just holds open routes like health

