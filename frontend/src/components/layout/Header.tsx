'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Music className="h-6 w-6" />
          findUtabs
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/browse">
            <Button variant="ghost">Browse</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
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
