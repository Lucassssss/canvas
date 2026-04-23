import { Router } from "express";
import { DeviceService } from "../services/device.service.js";
import { ApiResponse } from "../utils/response.js";

export const deviceRouter = Router();

// Get all devices
deviceRouter.get("/", async (req, res) => {
  try {
    const data = await DeviceService.listDevices();
    return ApiResponse.success(res, data);
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});

// Get single device
deviceRouter.get("/:id", async (req, res) => {
  try {
    const data = await DeviceService.getDevice(req.params.id);
    if (!data) return ApiResponse.error(res, "Device not found");
    return ApiResponse.success(res, data);
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});

// Test a device configuration before saving
deviceRouter.post("/test", async (req, res) => {
  try {
    const result = await DeviceService.testDeviceConnection(req.body);
    if (result.status === "success") {
      return ApiResponse.success(res, result);
    } else {
      return ApiResponse.error(res, "Proxy test failed or returned non-success data", result);
    }
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});

// Create new device
deviceRouter.post("/", async (req, res) => {
  try {
    const data = await DeviceService.createDevice(req.body);
    return ApiResponse.success(res, data);
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});

// Update device
deviceRouter.put("/:id", async (req, res) => {
  try {
    const data = await DeviceService.updateDevice(req.params.id, req.body);
    return ApiResponse.success(res, data);
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});

// Delete device
deviceRouter.delete("/:id", async (req, res) => {
  try {
    const data = await DeviceService.deleteDevice(req.params.id);
    return ApiResponse.success(res, data);
  } catch (error: any) {
    return ApiResponse.error(res, error.message);
  }
});
