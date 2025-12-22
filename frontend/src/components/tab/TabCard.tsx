import Link from 'next/link';
import { Tab } from '@/types/tab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface TabCardProps {
  tab: Tab;
}

export function TabCard({ tab }: TabCardProps) {
  return (
    <Link href={`/tab/${tab.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{tab.title}</CardTitle>
          <CardDescription>{tab.artist}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-3">
              <span className="text-muted-foreground">
                {tab.difficulty}
              </span>
              <span className="text-muted-foreground">
                {tab.tuning}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{tab.views}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            by {tab.username}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
