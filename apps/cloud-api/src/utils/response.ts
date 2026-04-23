import { Response } from "express";

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, code: number = 500, details: any = null) {
    return res.status(code).json({
      success: false,
      error: message,
      details,
    });
  }
}
