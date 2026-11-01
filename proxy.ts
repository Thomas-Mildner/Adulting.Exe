import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/navigation';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames and redirect unlocalized page routes
  matcher: ['/((?!api|uploads|_next|_vercel|.*\\..*).*)']
};

