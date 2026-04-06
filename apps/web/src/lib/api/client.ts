/**
 * API 客户端封装
 * 
 * 功能：
 * 1. 自动携带 cookie (credentials: 'include')
 * 2. 统一错误处理
 * 3. 401 自动重定向登录
 * 4. 请求拦截器
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>
type ResponseInterceptor = (response: Response) => Response | Promise<Response>
type ErrorInterceptor = (error: ApiError) => void | Promise<void>

interface Interceptors {
  request: RequestInterceptor[]
  response: ResponseInterceptor[]
  error: ErrorInterceptor[]
}

class ApiClient {
  private interceptors: Interceptors = {
    request: [],
    response: [],
    error: [],
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.interceptors.request.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.interceptors.response.push(interceptor)
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.interceptors.error.push(interceptor)
  }

  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let result = config
    for (const interceptor of this.interceptors.request) {
      result = await interceptor(result)
    }
    return result
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let result = response
    for (const interceptor of this.interceptors.response) {
      result = await interceptor(result)
    }
    return result
  }

  private async handleError(error: ApiError): Promise<never> {
    for (const interceptor of this.interceptors.error) {
      await interceptor(error)
    }
    throw error
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultConfig: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const config = await this.applyRequestInterceptors({
      ...defaultConfig,
      ...options,
    })

    try {
      const response = await fetch(url, config)
      const interceptedResponse = await this.applyResponseInterceptors(response)

      if (!interceptedResponse.ok) {
        const errorData = await interceptedResponse.json().catch(() => ({}))
        const error = new ApiError(
          errorData.error || errorData.message || 'Request failed',
          interceptedResponse.status,
          errorData
        )
        return this.handleError(error)
      }

      return interceptedResponse.json()
    } catch (err) {
      if (err instanceof ApiError) {
        return this.handleError(err)
      }
      const error = new ApiError(
        err instanceof Error ? err.message : 'Network error',
        0
      )
      return this.handleError(error)
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async stream(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ response: Response; url: string }> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultConfig: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const config = await this.applyRequestInterceptors({
      ...defaultConfig,
      ...options,
    })

    const response = await fetch(url, config)
    const interceptedResponse = await this.applyResponseInterceptors(response)

    return { response: interceptedResponse, url }
  }
}

export const apiClient = new ApiClient()

apiClient.addErrorInterceptor((error) => {
  if (error.status === 401) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
  }
})

export default apiClient
