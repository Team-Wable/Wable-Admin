'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError('카카오 로그인이 취소되었습니다.')
      setTimeout(() => router.push('/login'), 2000)
      return
    }

    if (!code) {
      setError('인증 코드가 없습니다.')
      setTimeout(() => router.push('/login'), 2000)
      return
    }

    handleKakaoLogin(code)
  }, [searchParams, router])

  const handleKakaoLogin = async (code: string) => {
    try {
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
          redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '',
          code,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (tokenData.error) {
        setError(`토큰 교환 실패: ${tokenData.error_description}`)
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      const response = await apiClient.login(tokenData.access_token, 'KAKAO')

      if (response.success && response.data) {
        if (!response.data.isAdmin) {
          setError('관리자 권한이 없습니다.')
          apiClient.clearTokens()
          setTimeout(() => router.push('/login'), 2000)
          return
        }
        router.push('/')
      } else {
        setError(response.message || '로그인에 실패했습니다.')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      console.error('Kakao login error:', err)
      setError('로그인 처리 중 오류가 발생했습니다.')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="text-center">
      {error ? (
        <div>
          <p className="body2 text-error mb-2">{error}</p>
          <p className="caption2 text-gray-600">로그인 페이지로 이동합니다...</p>
        </div>
      ) : (
        <div>
          <div className="w-8 h-8 border-4 border-purple-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body2 text-gray-700">카카오 로그인 처리 중...</p>
        </div>
      )}
    </div>
  )
}

export default function KakaoCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body2 text-gray-700">로딩 중...</p>
        </div>
      }>
        <KakaoCallbackContent />
      </Suspense>
    </div>
  )
}
