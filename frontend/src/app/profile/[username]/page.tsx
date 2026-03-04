'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTabsByUser } from '@/hooks/useTabs';
import { TabCard } from '@/components/tab/TabCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { User } from '@/types/user';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'username', username],
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/username/${username}`);
      return data;
    },
    enabled: !!username,
  });

  const { data: userTabs, isLoading: tabsLoading } = useTabsByUser(user?.id ?? 0);

  if (userLoading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{user.username}</CardTitle>
          <CardDescription>Member since {new Date(user.createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm font-medium">Role:</span>
            <span className="text-muted-foreground ml-2">{user.role}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tabs by {user.username}</h2>
        {tabsLoading ? (
          <p className="text-muted-foreground">Loading tabs...</p>
        ) : userTabs?.content.length === 0 ? (
          <p className="text-muted-foreground">No tabs uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTabs?.content.map((tab) => (
              <TabCard key={tab.id} tab={tab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
