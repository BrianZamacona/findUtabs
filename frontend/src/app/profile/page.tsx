'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTabsByUser, useDeleteTab, useUserFavorites } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabCard } from '@/components/tab/TabCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: userTabs, isLoading: tabsLoading } = useTabsByUser(user?.id ?? 0);
  const { data: favorites, isLoading: favLoading } = useUserFavorites();
  const deleteTab = useDeleteTab();
  const [activeSection, setActiveSection] = useState<'tabs' | 'favorites'>('tabs');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const totalViews = userTabs?.content.reduce((sum, t) => sum + t.views, 0) ?? 0;

  const handleDelete = (tabId: number) => {
    if (confirm('Are you sure you want to delete this tab?')) {
      deleteTab.mutate(tabId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and tabs</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><span className="text-sm font-medium">Username:</span><p className="text-muted-foreground">{user.username}</p></div>
            <div><span className="text-sm font-medium">Email:</span><p className="text-muted-foreground">{user.email}</p></div>
            <div><span className="text-sm font-medium">Role:</span><p className="text-muted-foreground">{user.role}</p></div>
            <div><span className="text-sm font-medium">Joined:</span><p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{userTabs?.totalElements ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Tabs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveSection('tabs')}
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${activeSection === 'tabs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            My Tabs ({userTabs?.totalElements ?? 0})
          </button>
          <button
            onClick={() => setActiveSection('favorites')}
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${activeSection === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Favorites ({favorites?.totalElements ?? 0})
          </button>
        </div>

        {activeSection === 'tabs' && (
          <div>
            {tabsLoading ? (
              <p className="text-muted-foreground">Loading your tabs...</p>
            ) : userTabs?.content.length === 0 ? (
              <p className="text-muted-foreground">You haven&apos;t uploaded any tabs yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {userTabs?.content.map((tab) => (
                  <div key={tab.id} className="relative">
                    <TabCard tab={tab} />
                    <button
                      onClick={() => handleDelete(tab.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors border"
                      title="Delete tab"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Link href="/tabs/create">
              <Button className="mt-4">Upload New Tab</Button>
            </Link>
          </div>
        )}

        {activeSection === 'favorites' && (
          <div>
            {favLoading ? (
              <p className="text-muted-foreground">Loading favorites...</p>
            ) : favorites?.content.length === 0 ? (
              <p className="text-muted-foreground">No favorites yet. Browse tabs and mark some as favorites!</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {favorites?.content.map((tab) => (
                  <TabCard key={tab.id} tab={tab} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
