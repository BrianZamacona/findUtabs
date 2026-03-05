'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminStats } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Music, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading } = useAdminStats();

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform management</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Music className="h-4 w-4" /> Total Tabs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalTabs ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Pending DMCA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.pendingDmcaReports ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>DMCA Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/dmca">
              <Button variant="outline" className="w-full">Review Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
