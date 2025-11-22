const API_BASE_URL = 'http://43.202.125.149'

interface ApiResponse<T> {
  status: number
  success: boolean
  message: string
  data: T
}

interface AuthResponse {
  nickName: string
  memberId: number
  accessToken: string
  refreshToken: string
  memberProfileUrl: string
  isNewUser: boolean
  isPushAlarmAllowed: boolean
  memberFanTeam: string
  memberLckYears: number
  memberLevel: number
  isAdmin: boolean
}

interface ContentPostRequest {
  contentTitle: string
  contentText?: string
}

class ApiClient {
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  clearTokens() {
    this.accessToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()
    return data
  }

  async login(socialToken: string, socialPlatform: string): Promise<ApiResponse<AuthResponse>> {
    // 프록시 API 사용 (CORS 우회)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        socialToken,
        socialPlatform,
      }),
    })

    const data = await response.json()

    if (data.success && data.data) {
      this.setAccessToken(data.data.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify({
          memberId: data.data.memberId,
          nickName: data.data.nickName,
          isAdmin: data.data.isAdmin,
          memberProfileUrl: data.data.memberProfileUrl,
        }))
      }
    }

    return data
  }

  async postContent(content: ContentPostRequest): Promise<ApiResponse<unknown>> {
    const token = this.getAccessToken()

    const response = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(content),
    })

    return response.json()
  }

  async getContents(cursor: number = -1): Promise<ApiResponse<unknown>> {
    return this.request(`/api/v3/contents?cursor=${cursor}`)
  }
}

export const apiClient = new ApiClient()
export type { AuthResponse, ContentPostRequest, ApiResponse }
