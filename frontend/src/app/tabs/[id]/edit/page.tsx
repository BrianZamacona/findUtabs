'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTabById, useUpdateTab } from '@/hooks/useTabs';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Difficulty, UpdateTabRequest } from '@/types/tab';

const AlphaTabViewer = dynamic(
  () => import('@/components/viewer/AlphaTabViewer').then((m) => m.AlphaTabViewer),
  { ssr: false, loading: () => <div className="p-2 text-sm text-muted-foreground">Loading preview...</div> },
);

export default function EditTabPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { user, isAuthenticated } = useAuth();
  const { data: tab, isLoading } = useTabById(id);
  const updateTab = useUpdateTab();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [tuning, setTuning] = useState('');
  const [alphaTexData, setAlphaTexData] = useState('');
  const [changeNotes, setChangeNotes] = useState('');
  const [previewData, setPreviewData] = useState('');
  const [previewTimer, setPreviewTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (tab) {
      setTitle(tab.title);
      setArtist(tab.artist);
      setDifficulty(tab.difficulty || Difficulty.BEGINNER);
      setTuning(tab.tuning || 'Standard');
      setAlphaTexData(tab.alphaTexData || '');
      setPreviewData(tab.alphaTexData || '');
    }
  }, [tab]);

  useEffect(() => {
    if (tab && user && tab.userId !== user.id) {
      router.push(`/tabs/${id}`);
    }
  }, [tab, user, id, router]);

  const handleAlphaTexChange = (value: string) => {
    setAlphaTexData(value);
    if (previewTimer) clearTimeout(previewTimer);
    const timer = setTimeout(() => setPreviewData(value), 500);
    setPreviewTimer(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: UpdateTabRequest = { title, artist, difficulty, tuning, alphaTexData: alphaTexData || undefined, changeNotes: changeNotes || undefined };
    updateTab.mutate({ id, data }, {
      onSuccess: () => router.push(`/tabs/${id}`),
    });
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!tab) return <div className="text-center py-12">Tab not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Tab</h1>
        <p className="text-muted-foreground">Update your guitar tablature</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tab Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist *</Label>
                <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
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
                <Input id="tuning" value={tuning} onChange={(e) => setTuning(e.target.value)} placeholder="Standard, Drop D..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeNotes">Change Notes</Label>
              <Input id="changeNotes" value={changeNotes} onChange={(e) => setChangeNotes(e.target.value)} placeholder="Describe what changed in this version..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AlphaTex Data</CardTitle>
            <CardDescription>Enter the tablature in AlphaTex format (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={alphaTexData}
              onChange={(e) => handleAlphaTexChange(e.target.value)}
              className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder="Enter AlphaTex format tablature..."
            />
            {previewData && (
              <div>
                <p className="text-sm font-medium mb-2">Preview</p>
                <AlphaTabViewer scoreData={previewData} title="Preview" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={updateTab.isPending}>
            {updateTab.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/tabs/${id}`)}>
            Cancel
          </Button>
        </div>

        {updateTab.error && (
          <p className="text-sm text-destructive">
            {updateTab.error instanceof Error ? updateTab.error.message : 'Failed to update tab'}
          </p>
        )}
      </form>
    </div>
  );
}
