import Link from 'next/link';

export default function CopyrightPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Copyright Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2025</p>
      </div>

      <div className="space-y-6">
        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">How We Handle Copyrighted Content</h2>
          <p className="text-muted-foreground">findUtabs takes intellectual property rights seriously. We require all users to only upload content they have the right to share. Guitar tablatures submitted by users must be their own original work or permissible transcriptions.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">DMCA Takedown Process</h2>
          <p className="text-muted-foreground">If you believe content on findUtabs infringes your copyright, you may submit a DMCA takedown notice. Your notice must include:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Your contact information</li>
            <li>Identification of the copyrighted work</li>
            <li>URL of the allegedly infringing content</li>
            <li>A statement of good faith belief</li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p className="text-muted-foreground mt-2">Submit your notice via our <Link href="/dmca" className="text-primary underline">DMCA form</Link>.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">Counter-Notice / Appeal Process</h2>
          <p className="text-muted-foreground">If you believe content was wrongly removed, you may submit a counter-notice. A valid counter-notice must include your contact information, identification of the removed content, a statement under penalty of perjury that the content was removed by mistake or misidentification, and consent to jurisdiction of the federal court.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">Fair Use</h2>
          <p className="text-muted-foreground">Some content may qualify as fair use under copyright law. Fair use factors include: the purpose and character of the use (educational, commentary, etc.), the nature of the copyrighted work, the amount used, and the effect on the market for the original work. We evaluate each case individually.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">Repeat Infringer Policy</h2>
          <p className="text-muted-foreground">findUtabs will terminate accounts of users who repeatedly infringe copyrights. We maintain a record of DMCA notices and take appropriate action against repeat infringers.</p>
        </section>
      </div>
    </div>
  );
}
