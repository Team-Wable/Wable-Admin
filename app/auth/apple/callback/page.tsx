'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

function AppleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const idToken = params.get('id_token') || searchParams.get('id_token')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError('Apple 로그인이 취소되었습니다.')
      setTimeout(() => router.push('/login'), 2000)
      return
    }

    if (!idToken) {
      setError('인증 토큰이 없습니다.')
      setTimeout(() => router.push('/login'), 2000)
      return
    }

    handleAppleLogin(idToken)
  }, [searchParams, router])

  const handleAppleLogin = async (idToken: string) => {
    try {
      const response = await apiClient.login(idToken, 'APPLE')

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
      console.error('Apple login error:', err)
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
          <p className="body2 text-gray-700">Apple 로그인 처리 중...</p>
        </div>
      )}
    </div>
  )
}

export default function AppleCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body2 text-gray-700">로딩 중...</p>
        </div>
      }>
        <AppleCallbackContent />
      </Suspense>
    </div>
  )
}
