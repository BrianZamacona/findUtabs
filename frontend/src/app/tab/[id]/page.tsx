'use client';

import { useParams } from 'next/navigation';
import { useTab } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Music } from 'lucide-react';

export default function TabDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: tab, isLoading } = useTab(id);

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
              <p className="text-muted-foreground">{tab.difficulty}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Tuning</span>
              <p className="text-muted-foreground">{tab.tuning}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Uploaded by</span>
              <p className="text-muted-foreground">{tab.username}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Date</span>
              <p className="text-muted-foreground">
                {new Date(tab.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-8 bg-muted/50">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Music className="h-8 w-8" />
              <p>Tab viewer will be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
