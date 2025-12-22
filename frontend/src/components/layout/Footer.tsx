export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} findUtabs. All rights reserved.</p>
          <p className="mt-2">A platform for guitar tablatures</p>
        </div>
      </div>
    </footer>
  );
}
