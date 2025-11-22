import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://43.202.125.149'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/v1/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json(
      { success: false, message: '서버 연결에 실패했습니다.' },
      { status: 500 }
    )
  }
}
