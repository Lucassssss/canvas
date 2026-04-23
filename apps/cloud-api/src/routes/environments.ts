import { Router } from "express";
import { EnvironmentService } from "../services/environment.service.js";
import { ApiResponse } from "../utils/response.js";

export const environmentRouter = Router();

// GET /api/environments - 获取环境列表
environmentRouter.get("/", async (req, res) => {
  try {
    const list = await EnvironmentService.listEnvironments();
    return ApiResponse.success(res, list);
  } catch (error: any) {
    console.error("[GET /api/environments] Error:", error);
    return ApiResponse.error(res, error.message);
  }
});

// GET /api/environments/:id - 获取单个环境
environmentRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await EnvironmentService.getEnvironment(id);
    if (!data) return ApiResponse.error(res, "Environment not found", 404);
    return ApiResponse.success(res, data);
  } catch (error: any) {
    console.error(`[GET /api/environments/${req.params.id}] Error:`, error);
    return ApiResponse.error(res, error.message);
  }
});

// POST /api/environments - 创建环境
environmentRouter.post("/", async (req, res) => {
  try {
    const newEnv = await EnvironmentService.createEnvironment(req.body);
    return ApiResponse.success(res, newEnv);
  } catch (error: any) {
    console.error("[POST /api/environments] Error:", error);
    return ApiResponse.error(res, error.message);
  }
});

// DELETE /api/environments/:id - 删除环境
environmentRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await EnvironmentService.deleteEnvironment(id);
    if (!success) {
      return ApiResponse.error(res, "Environment not found", 404);
    }
    return ApiResponse.success(res, null, "Environment deleted");
  } catch (error: any) {
    console.error(`[DELETE /api/environments/${req.params.id}] Error:`, error);
    return ApiResponse.error(res, error.message);
  }
});

// PUT /api/environments/:id - 快捷编辑环境
environmentRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await EnvironmentService.updateEnvironment(id, req.body);
    return ApiResponse.success(res, null, "Environment updated");
  } catch (error: any) {
    console.error(`[PUT /api/environments/${req.params.id}] Error:`, error);
    return ApiResponse.error(res, error.message);
  }
});

// POST /api/environments/:id/start - 启动浏览器环境
environmentRouter.post("/:id/start", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EnvironmentService.startEnvironment(id);
    return ApiResponse.success(res, result, "Environment started");
  } catch (error: any) {
    console.error(`[POST /api/environments/${req.params.id}/start] Error:`, error);
    return ApiResponse.error(res, error.message);
  }
});

// POST /api/environments/:id/stop - 停止浏览器环境
environmentRouter.post("/:id/stop", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EnvironmentService.stopEnvironment(id);
    return ApiResponse.success(res, result, "Environment stopped");
  } catch (error: any) {
    console.error(`[POST /api/environments/${req.params.id}/stop] Error:`, error);
    return ApiResponse.error(res, error.message);
  }
});
