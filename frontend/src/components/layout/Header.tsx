'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Music, Shield } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Music className="h-6 w-6" />
          findUtabs
        </Link>

        <nav className="flex items-center gap-2 flex-wrap">
          <Link href="/browse">
            <Button variant="ghost">Browse</Button>
          </Link>
          <Link href="/library">
            <Button variant="ghost">Library</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/tabs/create">
                <Button variant="ghost">Create Tab</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" className="text-orange-600">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/support">
                <Button variant="ghost" className="text-orange-500" aria-label="Support Us"><span aria-hidden="true">☕</span> Support</Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.username}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/support">
                <Button variant="ghost" className="text-orange-500" aria-label="Support Us"><span aria-hidden="true">☕</span> Support</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
