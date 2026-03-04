'use client';

import { useParams } from 'next/navigation';
import { useTabById } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Music } from 'lucide-react';
import Link from 'next/link';

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  EXPERT: 'bg-red-100 text-red-800',
};

export default function TabDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: tab, isLoading } = useTabById(id);

  if (isLoading) {
    return <div className="text-center py-12">Loading tab...</div>;
  }

  if (!tab) {
    return <div className="text-center py-12">Tab not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{tab.title}</CardTitle>
              <CardDescription className="text-lg">{tab.artist}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-5 w-5" />
              <span>{tab.views} views</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium">Difficulty</span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    DIFFICULTY_COLORS[tab.difficulty] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tab.difficulty}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Tuning</span>
              <p className="text-muted-foreground mt-1">{tab.tuning || 'Standard'}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Uploaded by</span>
              <p className="mt-1">
                <Link
                  href={`/profile/${tab.username}`}
                  className="text-primary hover:underline"
                >
                  {tab.username}
                </Link>
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Date</span>
              <p className="text-muted-foreground mt-1">
                {new Date(tab.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {tab.fileUrl && (
            <div>
              <a href={tab.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Tab File
                </Button>
              </a>
            </div>
          )}

          <div className="border rounded-lg p-8 bg-muted/50">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Music className="h-8 w-8" />
              <p>Tab viewer coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
