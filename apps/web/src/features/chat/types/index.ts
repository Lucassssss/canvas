export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  timestamp: number
  blocks?: MessageBlock[]
}

export interface MessageBlock {
  id: string
  type: 'reasoning' | 'text' | 'tool-call' | 'tool-result'
  content?: string
  name?: string
  input?: string
  output?: string
  status?: 'running' | 'completed' | 'error'
  isCollapsed?: boolean
}

export interface ChatThread {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export interface ChatState {
  messages: Message[]
  threads: ChatThread[]
  currentThreadId: string
  isLoading: boolean
  input: string
}

export type ChatAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'ADD_THREAD'; payload: ChatThread }
  | { type: 'SELECT_THREAD'; payload: string }
  | { type: 'ADD_BLOCK_TO_MESSAGE'; payload: { messageId: string; block: MessageBlock } }
  | { type: 'UPDATE_BLOCK'; payload: { messageId: string; blockId: string; updates: Partial<MessageBlock> } }
