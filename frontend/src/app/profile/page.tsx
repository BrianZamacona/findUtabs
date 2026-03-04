'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTabsByUser } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabCard } from '@/components/tab/TabCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: userTabs, isLoading: tabsLoading } = useTabsByUser(user?.id ?? 0);

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
          <div>
            <span className="text-sm font-medium">Joined:</span>
            <p className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Tabs</CardTitle>
          <CardDescription>Tabs you&apos;ve uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          {tabsLoading ? (
            <p className="text-muted-foreground">Loading your tabs...</p>
          ) : userTabs?.content.length === 0 ? (
            <p className="text-muted-foreground">You haven&apos;t uploaded any tabs yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userTabs?.content.map((tab) => (
                <TabCard key={tab.id} tab={tab} />
              ))}
            </div>
          )}
          <Link href="/tabs/create">
            <Button className="mt-4">Upload New Tab</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
