'use client';

import { useState } from 'react';
import { usePublicLibrary } from '@/hooks/useTranscriptions';
import { LibrarySongCard } from '@/components/transcriptions/LibrarySongCard';
import { Button } from '@/components/ui/button';

export default function LibraryPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = usePublicLibrary(page, 20);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Song Library</h1>
        <p className="text-muted-foreground">
          Discover transcribed songs from our community
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading library...</div>
      ) : data?.content.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No songs in the library yet.</div>
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
