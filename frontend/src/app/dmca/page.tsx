'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { DmcaReportRequest } from '@/types/dmca';

export default function DmcaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<DmcaReportRequest>({
    reporterName: '',
    reporterEmail: '',
    reporterCompany: '',
    contentUrl: '',
    originalWorkDescription: '',
    ownershipStatement: '',
    goodFaithStatement: false,
    accuracyStatement: false,
  });

  const updateField = <K extends keyof DmcaReportRequest>(
    field: K,
    value: DmcaReportRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.reporterName.trim() &&
    form.reporterEmail.trim() &&
    form.contentUrl.trim() &&
    form.originalWorkDescription.trim().length >= 50 &&
    form.ownershipStatement.trim() &&
    form.goodFaithStatement &&
    form.accuracyStatement;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    const payload: DmcaReportRequest = {
      reporterName: form.reporterName,
      reporterEmail: form.reporterEmail,
      contentUrl: form.contentUrl,
      originalWorkDescription: form.originalWorkDescription,
      ownershipStatement: form.ownershipStatement,
      goodFaithStatement: form.goodFaithStatement,
      accuracyStatement: form.accuracyStatement,
      ...(form.reporterCompany ? { reporterCompany: form.reporterCompany } : {}),
    };

    try {
      await api.post('/dmca/report', payload);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Report Submitted</CardTitle>
            <CardDescription>
              Your DMCA report has been received. We will review it promptly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DMCA Takedown Report</h1>
        <p className="text-muted-foreground mt-2">
          Use this form to report copyright infringement. All fields marked * are required.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Your Name *</Label>
                <Input
                  id="reporterName"
                  value={form.reporterName}
                  onChange={(e) => updateField('reporterName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterEmail">Email Address *</Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  value={form.reporterEmail}
                  onChange={(e) => updateField('reporterEmail', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporterCompany">Company (optional)</Label>
              <Input
                id="reporterCompany"
                value={form.reporterCompany}
                onChange={(e) => updateField('reporterCompany', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentUrl">URL of Infringing Content *</Label>
              <Input
                id="contentUrl"
                type="url"
                value={form.contentUrl}
                onChange={(e) => updateField('contentUrl', e.target.value)}
                placeholder="https://findutabs.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalWorkDescription">
                Description of Original Work *{' '}
                <span className="text-xs text-muted-foreground">(min 50 characters)</span>
              </Label>
              <textarea
                id="originalWorkDescription"
                value={form.originalWorkDescription}
                onChange={(e) => updateField('originalWorkDescription', e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Describe the original copyrighted work..."
                required
                minLength={50}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.originalWorkDescription.length} / 50 min characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownershipStatement">Ownership Statement *</Label>
              <textarea
                id="ownershipStatement"
                value={form.ownershipStatement}
                onChange={(e) => updateField('ownershipStatement', e.target.value)}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="I am the copyright owner or authorized to act on behalf of..."
                required
              />
            </div>

            <div className="rounded-md border border-orange-200 bg-orange-50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="goodFaithStatement"
                  checked={form.goodFaithStatement}
                  onChange={(e) => updateField('goodFaithStatement', e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                  required
                />
                <Label htmlFor="goodFaithStatement" className="cursor-pointer text-sm leading-relaxed">
                  I have a good faith belief that use of the copyrighted material described above is
                  not authorized by the copyright owner, its agent, or the law. *
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="accuracyStatement"
                  checked={form.accuracyStatement}
                  onChange={(e) => updateField('accuracyStatement', e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                  required
                />
                <Label htmlFor="accuracyStatement" className="cursor-pointer text-sm leading-relaxed">
                  The information in this notification is accurate, and under penalty of perjury, I
                  am the copyright owner or authorized to act on their behalf. *
                </Label>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit DMCA Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
