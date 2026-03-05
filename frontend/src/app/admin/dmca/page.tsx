'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDmcaReports, useAdminActionDmca } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  ACTIONED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function AdminDmcaPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data: reports, isLoading } = useAdminDmcaReports(page);
  const actionDmca = useAdminActionDmca();

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
          <h1 className="text-3xl font-bold">DMCA Reports</h1>
          <p className="text-muted-foreground">Review and action copyright reports</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin')}>← Back to Admin</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports ({reports?.totalElements ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : reports?.content.length === 0 ? (
            <p className="text-muted-foreground">No reports found.</p>
          ) : (
            <div className="space-y-4">
              {reports?.content.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium">{r.reporterName}</p>
                      <p className="text-sm text-muted-foreground">{r.reporterEmail}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] ?? ''}`}>
                      {r.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Content URL:</p>
                    <a href={r.contentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">{r.contentUrl}</a>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.originalWorkDescription}</p>
                  <p className="text-xs text-muted-foreground">Submitted: {new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.status === 'PENDING' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => actionDmca.mutate({ id: r.id, action: 'ACTIONED' })}
                        disabled={actionDmca.isPending}
                      >
                        Action (Remove Content)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actionDmca.mutate({ id: r.id, action: 'REJECTED' })}
                        disabled={actionDmca.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {reports && reports.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={reports.first}>Previous</Button>
              <span className="text-sm text-muted-foreground self-center">Page {page + 1} of {reports.totalPages}</span>
              <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={reports.last}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
