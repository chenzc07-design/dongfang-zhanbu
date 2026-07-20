import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 暂时禁用地区限制
  // 原因：用户在国内，需要用 VPN 管理网站。如果启用了 country block，
  // 即使用了 VPN Vercel 也可能识别成 CN 导致被屏蔽。
  // 暂时全部放行。
  return NextResponse.next();
}

export const config = {
  // 只拦截页面路由，不拦截 API 和静态资源
  matcher: [
    '/((?!api/|_next/|master/|favicon.ico).*)',
  ],
};
