export const metadata = { title: 'Realtor Kit', description: 'AI marketing kit for real estate' };
import './globals.css';
import { UserProvider } from './providers/UserProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
