export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2025</p>
      </div>

      <div className="space-y-6">
        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground">We collect information you provide directly, such as your username, email address, and password when you create an account. We also collect content you upload (tabs, ratings, comments) and usage data about how you interact with our service.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">We use the information we collect to: provide, maintain, and improve our services; authenticate you and keep your account secure; send you service-related communications; analyze usage patterns to improve the user experience; comply with legal obligations.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">3. Cookies</h2>
          <p className="text-muted-foreground">We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">4. Data Sharing</h2>
          <p className="text-muted-foreground">We do not sell, trade, or rent your personal information to third parties. We may share anonymized usage data for analytics purposes. We may disclose your information if required by law or to protect our rights.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">5. Your Rights (GDPR/CCPA)</h2>
          <p className="text-muted-foreground">You have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to processing of your data; data portability. To exercise these rights, please contact us through our platform.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">6. Data Retention</h2>
          <p className="text-muted-foreground">We retain your personal data for as long as your account is active or as needed to provide services. You may delete your account at any time, which will result in the deletion of your personal information, subject to legal obligations.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">7. Security</h2>
          <p className="text-muted-foreground">We use commercially reasonable security measures to protect your information. Your password is stored as a cryptographic hash. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">8. Contact Us</h2>
          <p className="text-muted-foreground">If you have questions about this Privacy Policy, please contact us through our platform. For data deletion requests, you may also delete your account from your profile settings.</p>
        </section>
      </div>
    </div>
  );
}
