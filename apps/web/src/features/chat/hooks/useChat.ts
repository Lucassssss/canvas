import { useChatStore } from '../store'

export function useChat() {
  const {
    messages,
    threads,
    currentThreadId,
    isLoading,
    input,
    conversationId,
    setInput,
    sendMessage,
    clearMessages,
    addThread,
    selectThread,
  } = useChatStore()

  const currentThread = threads.find((t) => t.id === currentThreadId)

  return {
    messages,
    threads,
    currentThread,
    currentThreadId,
    isLoading,
    input,
    conversationId,
    setInput,
    sendMessage,
    clearMessages,
    addThread,
    selectThread,
  }
}
