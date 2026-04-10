import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware, setAuthCookies } from "../middleware/auth.js";
import { runChat } from "../services/llm.js";
import { imageGenerationService, s3UploadService } from "../services/image/index.js";
import { sendVerificationCode } from "../services/sms/index.js";
import { loginWithCode } from "../services/auth/index.js";
import { consumeCredits, getPricingInfo, checkCredits } from "../services/credits/index.js";
import {
  getConversation,
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  getMessages,
  addMessage,
  clearMessages,
  generateTitle,
  convertToUIMessages,
} from "../services/conversation.js";
import projectRoutes from "./projects.js";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import creditRoutes from "./credits.js";
import paymentRoutes from "./payments.js";
import { handlePaymentCallback } from "../services/payment/index.js";
import {
  getEnabledModels,
  getModelStats,
} from "../services/image/model-configs.js";

const router = Router();

function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// ========== 公开接口 (无需认证) ==========
router.get("/api/credits/pricing", async (req: Request, res: Response) => {
  try {
    const models = await getPricingInfo()
    res.json({ models })
  } catch (error) {
    console.error('[API] Get pricing error:', error)
    res.status(500).json({ success: false, error: '获取价格信息失败' })
  }
})

function validatePhone(phone: unknown): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: false, error: '手机号不能为空' }
  }
  if (typeof phone !== 'string') {
    return { valid: false, error: '手机号格式错误' }
  }
  // const phoneRegex = /^1[3-9]\d{9}$/
  // if (!phoneRegex.test(phone)) {
  //   return { valid: false, error: '手机号格式错误' }
  // }
  return { valid: true }
}

function validateCode(code: unknown): { valid: boolean; error?: string } {
  if (!code) {
    return { valid: false, error: '验证码不能为空' }
  }
  if (typeof code !== 'string') {
    return { valid: false, error: '验证码格式错误' }
  }
  // const codeRegex = /^\d{6}$/
  // if (!codeRegex.test(code)) {
  //   return { valid: false, error: '验证码格式错误' }
  // }
  return { valid: true }
}

router.post("/api/auth/send-code", asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body
  
  const validation = validatePhone(phone)
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.error })
  }
  
  const result = await sendVerificationCode(phone)
  
  if (result.success) {
    res.json(result)
  } else {
    res.status(400).json(result)
  }
}))

router.post("/api/auth/verify-code", asyncHandler(async (req: Request, res: Response) => {
  const { phone, code } = req.body
  
  const phoneValidation = validatePhone(phone)
  if (!phoneValidation.valid) {
    return res.status(400).json({ success: false, error: phoneValidation.error })
  }
  
  const codeValidation = validateCode(code)
  if (!codeValidation.valid) {
    return res.status(400).json({ success: false, error: codeValidation.error })
  }
  
  const result = await loginWithCode(phone, code)
  
  if (result.success) {
    setAuthCookies(res, result.token!, result.refreshToken!)
    res.json({ success: true, user: result.user })
  } else {
    res.status(401).json(result)
  }
}))

router.post("/api/pay/wechat/notify", async (req: Request, res: Response) => {
  try {
    console.log('[Payment] WeChat notify received:', JSON.stringify(req.body, null, 2))
    const result = await handlePaymentCallback(req.body)
    console.log('[Payment] WeChat notify result:', result)
    res.json(result)
  } catch (error) {
    console.error('[Payment] WeChat notify error:', error)
    res.json({ code: 'FAIL', message: '处理失败' })
  }
})

// ========== 上传和生成 API (需要认证) ==========
router.post("/api/image/generate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId
    const { combinationTypeId, images, prompt, settings, slotContents } = req.body;

    if (!combinationTypeId) {
      return res.status(400).json({ success: false, error: "combinationTypeId is required" });
    }

    const modelId = settings?.model || 'openrouter-gemini-2-5-flash'
    
    const creditCheck = await checkCredits(userId, modelId)
    if (!creditCheck.sufficient) {
      return res.status(402).json({ 
        success: false, 
        error: '积分不足',
        required: creditCheck.required,
        current: creditCheck.current
      })
    }

    let inputImages = images || []
    
    if (slotContents && typeof slotContents === 'object') {
      const extractedImages: string[] = []
      for (const slotId of Object.keys(slotContents)) {
        const content = slotContents[slotId]
        if (content?.imageUrl) {
          extractedImages.push(content.imageUrl)
        }
      }
      if (extractedImages.length > 0) {
        inputImages = extractedImages
      }
    }

    const result = await imageGenerationService.generate({
      combinationTypeId,
      images: inputImages,
      prompt: prompt || "",
      settings: settings || { resolution: '2K', aspectRatio: '9:16' },
      slotContents,
    });

    if (result.success) {
      await consumeCredits(
        userId,
        modelId,
        'image_generate',
        '图片生成',
        { 
          combinationTypeId, 
          resolution: settings?.resolution,
          aspectRatio: settings?.aspectRatio,
          imageCount: result.images.length,
        }
      )
    }

    res.json({
      success: result.success,
      images: result.images,
      error: result.error,
    });
  } catch (error) {
    console.error("[API] Image generate error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/api/upload", authMiddleware, async (req, res) => {
  try {
    const { file, filename, contentType, folder } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, error: "file is required (base64 encoded)" });
    }

    const buffer = Buffer.from(file, "base64");
    const result = await s3UploadService.uploadFile(
      buffer,
      filename || "upload.png",
      {
        folder: folder || "uploads",
        contentType: contentType || "image/png",
      }
    );

    if (result.success) {
      res.json({ success: true, url: result.url, key: result.key });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("[API] Upload error:", error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

router.post("/api/upload/url", authMiddleware, async (req, res) => {
  try {
    const { imageUrl, folder } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: "imageUrl is required" });
    }

    const result = await s3UploadService.uploadFromUrl(imageUrl, folder || "ai-generated");

    if (result.success) {
      res.json({ success: true, url: result.url, key: result.key });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("[API] Upload from URL error:", error);
    res.status(500).json({ success: false, error: "Upload from URL failed" });
  }
});

router.post("/api/upload/signed-url", authMiddleware, async (req, res) => {
  try {
    const { filename, contentType, folder } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, error: "filename is required" });
    }

    const result = await s3UploadService.getSignedUploadUrl(
      filename,
      contentType || "image/png",
      folder || "uploads"
    );

    if (result.success) {
      res.json({ success: true, uploadUrl: result.uploadUrl, key: result.key, url: result.url });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("[API] Signed URL error:", error);
    res.status(500).json({ success: false, error: "Failed to generate signed URL" });
  }
});

// ========== 需要认证的 API ==========
router.use('/api/auth', authRoutes);
router.use('/api/projects', authMiddleware, projectRoutes);
router.use('/api/users', authMiddleware, userRoutes);
router.use('/api/credits', authMiddleware, creditRoutes);
router.use('/api/payments', paymentRoutes);

// ========== 需要认证的路由 ==========
router.get("/conversations", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const conversations = await getConversations(userId)
  res.json({ conversations })
}))

router.get("/conversations/:id", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const conversation = await getConversation(userId, req.params.id)
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" })
  }
  res.json({ conversation })
}))

router.post("/conversations", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const { title, model, mode } = req.body
  const conversation = await createConversation(userId, title, model, mode)
  res.status(201).json({ conversation })
}))

router.put("/conversations/:id", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  const { title, model, mode } = req.body
  try {
    await updateConversation(userId, req.params.id, { title, model, mode })
    res.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Conversation not found') {
      res.status(404).json({ error: 'Conversation not found' })
    } else {
      throw error
    }
  }
}))

router.delete("/conversations/:id", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId
  try {
    await deleteConversation(userId, req.params.id)
    res.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Conversation not found') {
      res.status(404).json({ error: 'Conversation not found' })
    } else {
      throw error
    }
  }
}))

router.get("/conversations/:id/messages", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const messages = await getMessages(req.params.id)
  res.json({ conversationId: req.params.id, messages })
}))

router.delete("/conversations/:id/messages", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  await clearMessages(req.params.id)
  res.json({ success: true })
}))

// ========== 需要认证的流式 API ==========
router.post("/api/chat", authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    const defaultModel = process.env.DEFAULT_MODEL;

    const { 
      conversationId, 
      messages, 
      mode = "agent", 
      model,
    } = req.body;

    const modelName = model || defaultModel;

    const creditCheck = await checkCredits(userId, modelName)
    if (!creditCheck.sufficient) {
      res.write(`data: ${JSON.stringify({ 
        type: "error", 
        error: '积分不足',
        required: creditCheck.required,
        current: creditCheck.current
      })}\n\n`)
      res.end()
      return
    }

    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const newConversation = await createConversation(userId, undefined, modelName, mode);
      currentConversationId = newConversation.id;
      res.write(`data: ${JSON.stringify({ type: "conversation_created", id: newConversation.id })}\n\n`);
    }

    const conversation = await getConversation(userId, currentConversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const historicalMessages = await getMessages(currentConversationId);
    const historicalUIMessages = convertToUIMessages(historicalMessages);

    const incomingUIMessages = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    const allMessages = [...historicalUIMessages, ...incomingUIMessages];

    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";

    try {
      let lastAssistantContent = "";
      
      await runChat(
        allMessages, 
        modelName, 
        res, 
        currentConversationId, 
        mode,
        (content, isComplete) => {
          if (isComplete) {
            lastAssistantContent = content;
          }
        }
      );

      res.write("data: [DONE]\n\n");

      for (const msg of incomingUIMessages) {
        await addMessage(currentConversationId, msg.role, msg.content);
      }

      if (lastAssistantContent) {
        await addMessage(currentConversationId, "assistant", lastAssistantContent);
        
        await consumeCredits(
          userId,
          modelName,
          'ai_chat',
          'AI 对话',
          { conversationId: currentConversationId }
        )
      }

      const currentMessages = await getMessages(currentConversationId);
      if (currentMessages.length === 2) {
        const title = await generateTitle(lastUserMessage);
        await updateConversation(userId, currentConversationId, { title });
        res.write(`data: ${JSON.stringify({ type: "title_generated", title })}\n\n`);
      }
    } catch (error) {
      console.error("Chat error:", error);
      if (!res.destroyed) {
        res.write(`data: ${JSON.stringify({ error: String(error) })}\n\n`);
      }
    } finally {
      if (!res.destroyed) res.end();
    }
  } catch (error) {
    console.error("Request error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    } else if (!res.destroyed) {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

// ========== 系统端点 ==========
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/models", (req, res) => {
  const stats = getModelStats();
  const models = getEnabledModels();

  res.json({
    success: true,
    data: {
      models,
      stats,
      defaultModel: process.env.DEFAULT_IMAGE_PROVIDER_ID,
    },
  });
});

export default router;
