import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const POSTS: {
  title: string;
  body: string;
  author: string;
  category: string;
}[] = [
  {
    title: 'Company Townhall',
    body: 'Join us this Friday at 3pm in the main hall for the quarterly townhall. Leadership will share results and answer your questions.',
    author: 'HR',
    category: 'General',
  },
  {
    title: 'Hari Raya Holiday Notice',
    body: 'The office will be closed for the Hari Raya break. Please plan your leave early and submit requests by the end of the month.',
    author: 'HR',
    category: 'Holiday',
  },
  {
    title: 'New Dental Benefit',
    body: 'From November, every full-time employee is covered for up to RM500 per year in dental care. Claim through the usual claims flow.',
    author: 'HR',
    category: 'Benefits',
  },
  {
    title: 'Q4 OKRs Published',
    body: 'The company and team OKRs for Q4 are now live. Review yours with your manager before the end of next week.',
    author: 'CEO',
    category: 'Strategy',
  },
  {
    title: 'Office Renovation — Level 3',
    body: 'Level 3 will undergo renovation over the next two weeks. Affected teams will be moved to Level 2 temporarily.',
    author: 'Admin',
    category: 'Facilities',
  },
];

export default function AnnouncementsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide updates for your team."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Announcement
          </Button>
        }
      />

      <div className="space-y-4">
        {POSTS.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <h2 className="font-semibold">{p.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
                {p.author[0]}
              </span>
              <span>{p.author}</span>
              <span>· 2 days ago</span>
              <Badge variant="secondary">{p.category}</Badge>
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
