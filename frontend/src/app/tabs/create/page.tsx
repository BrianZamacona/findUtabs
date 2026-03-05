'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useCreateTab } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Difficulty } from '@/types/tab';
import { useRouter } from 'next/navigation';

const AlphaTabViewer = dynamic(
  () => import('@/components/viewer/AlphaTabViewer').then((m) => m.AlphaTabViewer),
  { ssr: false, loading: () => <div className="p-2 text-sm text-muted-foreground">Loading preview...</div> },
);

export default function CreateTabPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const createTab = useCreateTab();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [tuning, setTuning] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [alphaTexData, setAlphaTexData] = useState('');
  const [previewData, setPreviewData] = useState('');
  const [previewTimer, setPreviewTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleAlphaTexChange = (value: string) => {
    setAlphaTexData(value);
    if (previewTimer) clearTimeout(previewTimer);
    const timer = setTimeout(() => setPreviewData(value), 500);
    setPreviewTimer(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTab.mutate(
      { title, artist, difficulty, tuning: tuning || undefined, fileUrl: fileUrl || undefined, alphaTexData: alphaTexData || undefined },
      {
        onSuccess: (tab) => {
          router.push(`/tabs/${tab.id}`);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Tab</CardTitle>
          <CardDescription>Share your guitar tablature with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Song title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
                placeholder="Artist or band name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={Difficulty.BEGINNER}>Beginner</option>
                <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                <option value={Difficulty.ADVANCED}>Advanced</option>
                <option value={Difficulty.EXPERT}>Expert</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuning">Tuning</Label>
              <Input
                id="tuning"
                value={tuning}
                onChange={(e) => setTuning(e.target.value)}
                placeholder="e.g. Standard, Drop D, Open G"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/tab.gp5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alphaTexData">AlphaTex Data (optional)</Label>
              <textarea
                id="alphaTexData"
                value={alphaTexData}
                onChange={(e) => handleAlphaTexChange(e.target.value)}
                className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="Enter AlphaTex format tablature..."
              />
            </div>
            {previewData && (
              <div>
                <p className="text-sm font-medium mb-2">Preview</p>
                <AlphaTabViewer scoreData={previewData} title="Preview" />
              </div>
            )}

            {createTab.error && (
              <p className="text-sm text-destructive">
                {createTab.error instanceof Error
                  ? createTab.error.message
                  : 'Failed to create tab'}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={createTab.isPending}>
              {createTab.isPending ? 'Creating...' : 'Create Tab'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
