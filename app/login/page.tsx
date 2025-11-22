'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // 이미 로그인된 경우 대시보드로 이동
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        if (user.isAdmin) {
          router.push('/')
        }
      } catch {
        // 잘못된 데이터는 무시
      }
    }
  }, [router])

  const handleKakaoLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&response_type=code`

    window.location.href = kakaoAuthUrl
  }

  const handleAppleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI

    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&response_type=code id_token&response_mode=fragment&scope=name email`

    window.location.href = appleAuthUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="head1 text-purple-50">Wable Admin</CardTitle>
          <CardDescription className="body4">
            관리자 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 카카오 로그인 */}
          <Button
            onClick={handleKakaoLogin}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
            </svg>
            카카오로 로그인
          </Button>

          {/* Apple 로그인 */}
          <Button
            onClick={handleAppleLogin}
            className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple로 로그인
          </Button>

          <p className="caption4 text-gray-600 text-center pt-4">
            관리자 권한이 있는 계정만 로그인할 수 있습니다
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
