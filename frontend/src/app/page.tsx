import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Search, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to findUtabs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover, share, and learn guitar tablatures from musicians around the world.
          Your journey to mastering the guitar starts here.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/browse">
            <Button size="lg">Browse Tabs</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">Get Started</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-3">
          <Search className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Easy Search</h3>
          <p className="text-muted-foreground">
            Find tabs by artist, song title, or difficulty level
          </p>
        </div>
        <div className="text-center space-y-3">
          <Users className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Community Driven</h3>
          <p className="text-muted-foreground">
            Share your tabs and learn from fellow musicians
          </p>
        </div>
        <div className="text-center space-y-3">
          <TrendingUp className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Popular Content</h3>
          <p className="text-muted-foreground">
            Discover trending tabs and top-rated content
          </p>
        </div>
      </section>

      <section className="text-center space-y-6 py-12 bg-secondary/50 rounded-lg">
        <Music className="h-16 w-16 mx-auto text-primary" />
        <h2 className="text-3xl font-bold">Ready to start playing?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join thousands of guitarists sharing and learning tabs
        </p>
        <Link href="/register">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </section>
    </div>
  );
}
