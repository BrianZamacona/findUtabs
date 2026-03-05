'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers, useAdminDeleteUser, useAdminBanUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data: users, isLoading } = useAdminUsers(page);
  const deleteUser = useAdminDeleteUser();
  const banUser = useAdminBanUser();

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin')}>← Back to Admin</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users?.totalElements ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-2">
              {users?.content.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{u.username}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">Role: {u.role} · Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => banUser.mutate(u.id)}
                      disabled={banUser.isPending}
                    >
                      {u.role === 'BANNED' ? 'Unban' : 'Ban'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete user ${u.username}?`)) deleteUser.mutate(u.id);
                      }}
                      disabled={deleteUser.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {users && users.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={users.first}>Previous</Button>
              <span className="text-sm text-muted-foreground self-center">Page {page + 1} of {users.totalPages}</span>
              <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={users.last}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
