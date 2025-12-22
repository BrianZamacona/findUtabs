'use client';

import { useTabs, useTopTabs } from '@/hooks/useTabs';
import { TabCard } from '@/components/tab/TabCard';
import { Button } from '@/components/ui/button';

export default function BrowsePage() {
  const { data: paginatedTabs, isLoading } = useTabs(0, 20);
  const { data: topTabs } = useTopTabs();

  if (isLoading) {
    return <div className="text-center py-12">Loading tabs...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Tablatures</h1>
        <p className="text-muted-foreground">
          Discover guitar tabs from our community
        </p>
      </div>

      {topTabs && topTabs.length > 0 && (
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
        <h2 className="text-2xl font-semibold mb-4">All Tabs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTabs?.content.map((tab) => (
            <TabCard key={tab.id} tab={tab} />
          ))}
        </div>
        {paginatedTabs && !paginatedTabs.last && (
          <div className="text-center mt-8">
            <Button>Load More</Button>
          </div>
        )}
      </section>
    </div>
  );
}
