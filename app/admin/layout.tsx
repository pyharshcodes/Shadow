import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If user is logged in, wrap in AdminNav shell.
  // If not logged in, children (e.g. login page) will handle its own display or redirect.
  return (
    <div className="min-h-screen bg-[#09090c] text-zinc-100 flex flex-col md:flex-row font-sans antialiased">
      {user ? (
        <AdminNav user={user}>
          {children}
        </AdminNav>
      ) : (
        <div className="flex-1 w-full min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      )}
    </div>
  );
}
