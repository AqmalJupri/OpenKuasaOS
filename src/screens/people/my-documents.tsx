import { Download, FileText, Upload } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';

type DocumentItem = {
  name: string;
  type: string;
  size: string;
};

const DOCUMENTS: DocumentItem[] = [
  { name: 'Payslip — Sep 2026', type: 'PDF', size: '112 KB' },
  { name: 'Employment Contract', type: 'PDF', size: '240 KB' },
  { name: 'Offer Letter', type: 'PDF', size: '98 KB' },
  { name: 'EA Form 2025', type: 'PDF', size: '76 KB' },
  { name: 'Confirmation Letter', type: 'PDF', size: '64 KB' },
  { name: 'Medical Card', type: 'PDF', size: '1.2 MB' },
];

export default function MyDocumentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Documents"
        subtitle="Payslips, contracts & letters."
        actions={
          <Button variant="outline" size="sm">
            <Upload className="size-4" />
            Upload
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENTS.map((d) => (
          <div key={d.name} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <p className="mt-3 font-medium">{d.name}</p>
            <p className="text-xs text-muted-foreground">
              {d.type} · {d.size}
            </p>
            <Button variant="ghost" size="sm" className="mt-2">
              <Download className="size-4" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
