import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 로그인 페이지는 인증 불필요
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // 클라이언트 사이드에서 토큰 체크를 하므로 서버에서는 기본 통과
  // 실제 인증은 클라이언트에서 localStorage 체크
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
