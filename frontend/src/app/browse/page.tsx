'use client';

import { useState } from 'react';
import { useAllTabs, useSearchTabsByArtist, useSearchTabsByTitle, useTopTabs } from '@/hooks/useTabs';
import { TabCard } from '@/components/tab/TabCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SearchType = 'title' | 'artist';
type SortOption = 'createdAt,desc' | 'createdAt,asc' | 'views,desc';

export default function BrowsePage() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [sort, setSort] = useState<SortOption>('createdAt,desc');

  const isSearching = !!activeSearch;

  const { data: allTabs, isLoading: allLoading } = useAllTabs(page, 20, sort);
  const { data: searchByTitle, isLoading: titleLoading } = useSearchTabsByTitle(
    searchType === 'title' ? activeSearch : '',
    page,
    20,
  );
  const { data: searchByArtist, isLoading: artistLoading } = useSearchTabsByArtist(
    searchType === 'artist' ? activeSearch : '',
    page,
    20,
  );
  const { data: topTabs } = useTopTabs();

  const isLoading = isSearching ? (searchType === 'title' ? titleLoading : artistLoading) : allLoading;
  const paginatedData = isSearching
    ? searchType === 'title'
      ? searchByTitle
      : searchByArtist
    : allTabs;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPage(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Tablatures</h1>
        <p className="text-muted-foreground">Discover guitar tabs from our community</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>
          <Input
            placeholder={`Search by ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button type="submit">Search</Button>
        {activeSearch && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </form>

      {!isSearching && (
        <div className="flex items-center gap-3">
          <Label>Sort by:</Label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(0); }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="createdAt,desc">Newest first</option>
            <option value="createdAt,asc">Oldest first</option>
            <option value="views,desc">Most viewed</option>
          </select>
        </div>
      )}

      {!isSearching && topTabs && topTabs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Tabs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTabs.slice(0, 6).map((tab) => (
              <TabCard key={tab.id} tab={tab} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {isSearching ? `Results for "${activeSearch}"` : 'All Tabs'}
        </h2>

        {isLoading ? (
          <div className="text-center py-12">Loading tabs...</div>
        ) : paginatedData?.content.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No tabs found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData?.content.map((tab) => (
              <TabCard key={tab.id} tab={tab} />
            ))}
          </div>
        )}

        {paginatedData && (paginatedData.totalPages > 1) && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={paginatedData.first}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {paginatedData.pageable.pageNumber + 1} of {paginatedData.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={paginatedData.last}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
