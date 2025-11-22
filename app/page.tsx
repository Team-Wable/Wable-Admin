'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api'

interface User {
  memberId: number
  nickName: string
  isAdmin: boolean
  memberProfileUrl: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 게시글 작성 상태
  const [contentTitle, setContentTitle] = useState('')
  const [contentText, setContentText] = useState('')
  const [posting, setPosting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.isAdmin) {
        apiClient.clearTokens()
        router.push('/login')
        return
      }
      setUser(parsedUser)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    apiClient.clearTokens()
    router.push('/login')
  }

  const handlePostContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)
    setMessage('')

    try {
      const response = await apiClient.postContent({
        contentTitle,
        contentText: contentText || undefined,
      })

      if (response.success) {
        setMessage('게시글이 작성되었습니다.')
        setContentTitle('')
        setContentText('')
      } else {
        setMessage(response.message || '게시글 작성에 실패했습니다.')
      }
    } catch (err) {
      setMessage('서버 연결에 실패했습니다.')
      console.error(err)
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="body2 text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="head1 text-purple-50">Wable Admin</h1>
          <div className="flex items-center gap-4">
            <span className="body4 text-gray-700">
              {user?.nickName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="head2">게시글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostContent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="body3">제목 *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="게시글 제목을 입력하세요"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text" className="body3">내용</Label>
                <textarea
                  id="text"
                  className="w-full min-h-[200px] p-3 border border-input rounded-md bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="게시글 내용을 입력하세요"
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                />
              </div>

              {message && (
                <p className={`body4 text-center ${message.includes('실패') ? 'text-error' : 'text-success'}`}>
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={posting || !contentTitle}
              >
                {posting ? '작성 중...' : '게시글 작성'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
