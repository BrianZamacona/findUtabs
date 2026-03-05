'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTabById, useTabRatings, useRateTab, useToggleFavorite, useTabVersions } from '@/hooks/useTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Music, Heart, Star, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { TabRatingRequest } from '@/types/tab';

const AlphaTabViewer = dynamic(
  () => import('@/components/viewer/AlphaTabViewer').then((m) => m.AlphaTabViewer),
  { ssr: false, loading: () => <div className="p-4 text-center text-muted-foreground">Loading viewer...</div> },
);

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  EXPERT: 'bg-red-100 text-red-800',
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function TabDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: tab, isLoading } = useTabById(id);
  const { data: ratings } = useTabRatings(id);
  const { data: versions } = useTabVersions(id);
  const rateTab = useRateTab();
  const toggleFavorite = useToggleFavorite();
  const { user, isAuthenticated } = useAuth();

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingValue) return;
    const data: TabRatingRequest = { rating: ratingValue, comment: ratingComment || undefined };
    rateTab.mutate({ tabId: id, data }, {
      onSuccess: () => {
        setRatingValue(0);
        setRatingComment('');
      },
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(id, {
      onSuccess: (res) => setIsFavorite(res.favorite),
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading tab...</div>;
  }

  if (!tab) {
    return <div className="text-center py-12">Tab not found</div>;
  }

  const isOwner = user?.id === tab.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">{tab.title}</CardTitle>
              <CardDescription className="text-lg">{tab.artist}</CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span>{tab.views} views</span>
              </div>
              {tab.averageRating !== undefined && tab.averageRating !== null && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-yellow-400" />
                  <span>{tab.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">({tab.ratingCount})</span>
                </div>
              )}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={isFavorite ? 'text-red-500 border-red-300' : ''}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Favorite'}
                </Button>
              )}
              {isOwner && (
                <Link href={`/tabs/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit Tab
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium">Difficulty</span>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[tab.difficulty] ?? 'bg-gray-100 text-gray-800'}`}>
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
                <Link href={`/profile/${tab.username}`} className="text-primary hover:underline">
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

          {tab.alphaTexData ? (
            <AlphaTabViewer scoreData={tab.alphaTexData} title={`${tab.title} — ${tab.artist}`} />
          ) : (
            <div className="border rounded-lg p-8 bg-muted/50">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Music className="h-8 w-8" />
                <p>Tab viewer coming soon</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ratings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings &amp; Reviews</CardTitle>
          {tab.averageRating !== undefined && tab.averageRating !== null && (
            <CardDescription>
              Average: {tab.averageRating.toFixed(1)} / 5 ({tab.ratingCount} {tab.ratingCount === 1 ? 'rating' : 'ratings'})
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated && (
            <form onSubmit={handleRatingSubmit} className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <p className="font-medium text-sm">Leave a rating</p>
              <StarRating value={ratingValue} onChange={setRatingValue} />
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Add a comment (optional)..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button type="submit" disabled={!ratingValue || rateTab.isPending} size="sm">
                {rateTab.isPending ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </form>
          )}
          {ratings && ratings.length > 0 ? (
            <div className="space-y-3">
              {ratings.map((r) => (
                <div key={r.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Link href={`/profile/${r.username}`} className="font-medium text-sm hover:underline">
                      {r.username}
                    </Link>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {'★'.repeat(r.rating)}
                      <span className="text-muted-foreground text-xs ml-1">({r.rating}/5)</span>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No ratings yet. Be the first to rate this tab!</p>
          )}
        </CardContent>
      </Card>

      {/* Version History */}
      {versions && versions.length > 0 && (
        <Card>
          <CardHeader>
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowVersions((v) => !v)}
            >
              <CardTitle>Version History ({versions.length})</CardTitle>
              {showVersions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </CardHeader>
          {showVersions && (
            <CardContent>
              <div className="space-y-2">
                {versions.map((v) => (
                  <div key={v.id} className="border rounded p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">v{v.versionNumber}</span>
                      <span className="text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>
                    {v.changeNotes && <p className="text-muted-foreground mt-1">{v.changeNotes}</p>}
                    <p className="text-xs text-muted-foreground">by {v.createdByUsername}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
