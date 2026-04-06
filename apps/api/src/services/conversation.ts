import { nanoid } from "nanoid"
import { db, conversations, messages } from '../db/index.js'
import { eq, asc, and } from 'drizzle-orm'
import type { Conversation, Message } from "../types/index.js"

type ProjectMode = 'agent' | 'chat'

function generateId(): string {
  return nanoid()
}

export async function createConversation(
  userId: string, 
  title?: string, 
  model?: string, 
  mode?: ProjectMode
): Promise<Conversation> {
  const id = generateId()
  const defaultTitle = title || "New Conversation"

  const [row] = await db.insert(conversations).values({
    id,
    userId,
    title: defaultTitle,
    model: model || "deepseek/deepseek-chat",
    mode: mode || "agent",
  }).returning()

  return row
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(asc(conversations.updatedAt))
  
  return rows
}

export async function getConversation(userId: string, id: string): Promise<Conversation | null> {
  const [row] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
  
  return row ?? null
}

export async function updateConversation(
  userId: string,
  id: string, 
  data: Partial<Pick<Conversation, "title" | "model" | "mode">>
): Promise<void> {
  const conversation = await getConversation(userId, id)
  if (!conversation) {
    throw new Error('Conversation not found')
  }

  const updateData: Record<string, unknown> = {}

  if (data.title !== undefined) {
    updateData.title = data.title
  }
  if (data.model !== undefined) {
    updateData.model = data.model
  }
  if (data.mode !== undefined) {
    updateData.mode = data.mode
  }

  if (Object.keys(updateData).length > 0) {
    await db
      .update(conversations)
      .set(updateData)
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
  }
}

export async function deleteConversation(userId: string, id: string): Promise<void> {
  const conversation = await getConversation(userId, id)
  if (!conversation) {
    throw new Error('Conversation not found')
  }

  await db.delete(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
  
  return rows
}

export async function addMessage(
  conversationId: string, 
  role: "user" | "assistant" | "system", 
  content: string
): Promise<Message> {
  const id = generateId()

  const [row] = await db.insert(messages).values({
    id,
    conversationId,
    role,
    content,
  }).returning()

  return row
}

export async function clearMessages(conversationId: string): Promise<void> {
  await db.delete(messages).where(eq(messages.conversationId, conversationId))
}

export async function generateTitle(userMessage: string): Promise<string> {
  const { generateText } = await import('ai')
  const { text } = await generateText({
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "user",
        content: `Generate a short title (max 30 characters) for this conversation based on the first message. Just return the title, nothing else.\n\nFirst message: ${userMessage}`
      }
    ],
    maxOutputTokens: 50,
  })

  return text.trim().slice(0, 50)
}

export function convertToUIMessages(msgs: Message[]): { role: "user" | "assistant" | "system"; content: string }[] {
  return msgs.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))
}
