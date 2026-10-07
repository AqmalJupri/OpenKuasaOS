import { Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type Creative = {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Copy';
  ctr: string;
};

const CREATIVES: Creative[] = [
  { id: '1', name: 'Raya Sale — Square', type: 'Image', ctr: 'CTR 2.4%' },
  { id: '2', name: 'Product Hero 9:16', type: 'Video', ctr: 'CTR 3.1%' },
  { id: '3', name: 'Testimonial Reel', type: 'Video', ctr: 'CTR 4.2%' },
  { id: '4', name: 'Carousel — 3 slides', type: 'Image', ctr: 'CTR 1.9%' },
  { id: '5', name: 'Flash Sale Banner', type: 'Image', ctr: 'CTR 2.8%' },
  { id: '6', name: 'Founder Story', type: 'Video', ctr: 'CTR 3.6%' },
  { id: '7', name: 'Before/After', type: 'Image', ctr: 'CTR 2.1%' },
  { id: '8', name: 'Promo Code Card', type: 'Copy', ctr: 'CTR 1.7%' },
];

function CreativeGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {CREATIVES.map((c) => (
        <div
          key={c.id}
          className="overflow-hidden rounded-xl border bg-card shadow-sm"
        >
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-primary/10 text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
          <div className="p-3">
            <p className="truncate font-medium">{c.name}</p>
            <div className="flex items-center justify-between pt-1">
              <Badge variant="secondary">{c.type}</Badge>
              <span className="text-xs text-muted-foreground">{c.ctr}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CreativeBankScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Creative Bank"
        subtitle="Your library of ad creatives and copy."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" />
              Upload
            </Button>
            <Button size="sm">
              <Sparkles className="size-4" />
              Generate with AI
            </Button>
          </>
        }
      />

      <Tabs defaultValue="all" className="gap-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="copy">Copy</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CreativeGrid />
        </TabsContent>
        <TabsContent value="images">
          <CreativeGrid />
        </TabsContent>
        <TabsContent value="videos">
          <CreativeGrid />
        </TabsContent>
        <TabsContent value="copy">
          <CreativeGrid />
        </TabsContent>
      </Tabs>
    </ScreenContainer>
  );
}
