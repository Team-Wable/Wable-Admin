import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://43.202.125.149'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { socialToken, socialPlatform } = body

    const response = await fetch(`${API_BASE_URL}/api/v2/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': socialToken,
      },
      body: JSON.stringify({
        socialPlatform,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: '서버 연결에 실패했습니다.' },
      { status: 500 }
    )
  }
}
