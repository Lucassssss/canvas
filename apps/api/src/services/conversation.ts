import { nanoid } from "nanoid"
import { db, conversations, messages, projectModeEnum } from '../db/index.js'
import { eq, asc } from 'drizzle-orm'
import type { Conversation, Message } from "../types/index.js"

type ProjectMode = 'agent' | 'chat'

function generateId(): string {
  return nanoid()
}

export async function createConversation(title?: string, model?: string, mode?: ProjectMode): Promise<Conversation> {
  const id = generateId()
  const defaultTitle = title || "New Conversation"

  await db.insert(conversations).values({
    id,
    title: defaultTitle,
    model: model || "deepseek/deepseek-chat",
    mode: mode || "agent",
  })

  const [row] = await db.select().from(conversations).where(eq(conversations.id, id))

  return {
    id: row.id,
    title: row.title,
    model: row.model,
    mode: row.mode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function getConversations(): Promise<Conversation[]> {
  const rows = await db.select().from(conversations)
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    model: row.model,
    mode: row.mode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const [row] = await db.select().from(conversations).where(eq(conversations.id, id))
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    model: row.model,
    mode: row.mode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function updateConversation(id: string, data: Partial<Pick<Conversation, "title" | "model" | "mode">>): Promise<void> {
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
    await db.update(conversations).set(updateData).where(eq(conversations.id, id))
  }
}

export async function deleteConversation(id: string): Promise<void> {
  await db.delete(messages).where(eq(messages.conversationId, id))
  await db.delete(conversations).where(eq(conversations.id, id))
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const rows = await db.select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
  return rows.map(row => ({
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt,
  }))
}

export async function addMessage(conversationId: string, role: "user" | "assistant" | "system", content: string): Promise<Message> {
  const id = generateId()

  await db.insert(messages).values({
    id,
    conversationId,
    role,
    content,
  })

  const [row] = await db.select().from(messages).where(eq(messages.id, id))

  return {
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt,
  }
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
