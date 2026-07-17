import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vercel 会自动注入访问者的国家代码
  // 在本地开发时这个 header 不存在，不影响调试
  const country = request.headers.get('x-vercel-ip-country') || '';
  const region = request.headers.get('x-vercel-ip-country-region') || '';

  // 屏蔽中国大陆
  if (country === 'CN') {
    return new NextResponse(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Access Restricted</title>' +
      '<style>body{background:#0a0e1a;color:#d4a853;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:2rem;}' +
      '.c{max-width:400px;}h1{font-size:1.5rem;margin-bottom:1rem;}' +
      'p{color:#8a7a6a;font-size:0.875rem;line-height:1.6;}' +
      '</style></head><body>' +
      '<div class="c">' +
      '<h1>🚫 Access Restricted</h1>' +
      '<p>This service is not available in your region. ' +
      'If you believe this is an error, please contact support.</p>' +
      '</div></body></html>',
      {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  // 只拦截页面路由，不拦截 API 和静态资源
  matcher: [
    '/((?!api/|_next/|master/|favicon.ico).*)',
  ],
};
