'use client';

import { useState, useEffect } from 'react';
import { useMyLibrary } from '@/hooks/useTranscriptions';
import { useAuth } from '@/hooks/useAuth';
import { LibrarySongCard } from '@/components/transcriptions/LibrarySongCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function MyLibraryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useMyLibrary(page, 20);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-muted-foreground">
          Your personal collection of transcribed songs
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading your library...</div>
      ) : data?.content.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Your library is empty. Visit the{' '}
          <a href="/transcribe" className="text-primary hover:underline">
            transcribe page
          </a>{' '}
          to add songs.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.content.map((song) => (
            <LibrarySongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.pageable.pageNumber + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
