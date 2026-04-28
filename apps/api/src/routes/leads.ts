import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: port === "465",
    auth: { user, pass },
  });
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, contact, teamSize, needs } = req.body;

    if (!name || !contact || !teamSize) {
      return res.status(400).json({ success: false, error: "请填写称呼、联系方式和团队规模" });
    }

    const transporter = createTransporter();

    if (!transporter) {
      console.warn("[Leads] Email service not configured. Form data received:", req.body);
      // Even if email is not configured, we return success so frontend doesn't break, 
      // but we log it in the server.
      return res.json({ success: true, message: "提交成功（系统暂未配置邮件通知）" });
    }

    const defaultFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
    const toEmail = process.env.SMTP_USER; // Default to sending to self

    const htmlContent = `
      <h2>新客户浆果浏览器方案咨询</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top:20px">
        <tr>
          <td style="background-color: #f3f4f6; font-weight: bold; width: 120px;">客户称呼</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td style="background-color: #f3f4f6; font-weight: bold;">联系方式</td>
          <td>${contact}</td>
        </tr>
        <tr>
          <td style="background-color: #f3f4f6; font-weight: bold;">团队规模</td>
          <td>${teamSize}</td>
        </tr>
        <tr>
          <td style="background-color: #f3f4f6; font-weight: bold;">需求简述</td>
          <td>${needs || '无'}</td>
        </tr>
        <tr>
          <td style="background-color: #f3f4f6; font-weight: bold;">提交时间</td>
          <td>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</td>
        </tr>
      </table>
      <br />
      <p style="color: #6b7280; font-size: 12px;">此邮件由浆果浏览器官网联系系统自动发送。</p>
    `;

    await transporter.sendMail({
      from: defaultFrom,
      to: toEmail,
      subject: `[新客咨询] 浆果浏览器方案 - ${name}`,
      text: `新客户咨询：\n称呼：${name}\n联系方式：${contact}\n团队规模：${teamSize}\n需求：${needs || '无'}`,
      html: htmlContent,
    });

    console.log(`[Leads] Email notification sent successfully for lead: ${name}`);
    res.json({ success: true, message: "提交成功" });

  } catch (error) {
    console.error("[Leads] Failed to send email:", error);
    res.status(500).json({ success: false, error: "提交失败，服务器发生错误" });
  }
});

export default router;
