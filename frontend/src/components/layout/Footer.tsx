import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground mb-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">findUtabs</h3>
            <p>A community platform for guitar tablatures. Share, discover, and learn.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/copyright" className="hover:text-foreground transition-colors">Copyright Policy</Link></li>
              <li><Link href="/dmca" className="hover:text-foreground transition-colors">DMCA</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/browse" className="hover:text-foreground transition-colors">Browse Tabs</Link></li>
              <li><Link href="/tabs/create" className="hover:text-foreground transition-colors">Upload Tab</Link></li>
              <li><Link href="/support" className="hover:text-foreground transition-colors">Support Us ☕</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} findUtabs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
