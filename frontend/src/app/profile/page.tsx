'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and tabs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm font-medium">Username:</span>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Email:</span>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Role:</span>
            <p className="text-muted-foreground">{user.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Tabs</CardTitle>
          <CardDescription>Tabs you&apos;ve uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your uploaded tabs will appear here
          </p>
          <Button className="mt-4">Upload New Tab</Button>
        </CardContent>
      </Card>
    </div>
  );
}
