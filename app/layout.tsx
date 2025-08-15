export const metadata = { title: 'Realtor Kit', description: 'AI marketing kit for real estate' };
export const dynamic = 'force-dynamic'; // Required for headers() access
import './globals.css';
import { UserProvider } from './providers/UserProvider';
import { getServerAuthFromHeaders } from '@/lib/auth-server';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Get auth data from middleware headers - instant, no loading
  const authData = getServerAuthFromHeaders();
  
  return (
    <html lang="en">
      <body>
        <UserProvider initialData={authData || undefined}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
