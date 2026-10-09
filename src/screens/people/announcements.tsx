import { Bell, Megaphone, MailCheck, PieChart, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, Sparkline, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ---- mock data (Rimba Ventures Sdn Bhd · Saudara) ----------------- */

type Category = 'General' | 'Holiday' | 'Benefits' | 'Strategy' | 'Policy';

type Post = {
  title: string;
  body: string;
  author: string;
  category: Category;
  ago: string;
  unread: boolean;
  thisMonth: boolean;
};

const POSTS: Post[] = [
  {
    title: 'Company Townhall',
    body: 'Join us this Friday at 3pm in the main hall for the quarterly townhall. Leadership will share results and answer your questions.',
    author: 'HR',
    category: 'General',
    ago: '2 hours ago',
    unread: true,
    thisMonth: true,
  },
  {
    title: 'Hari Raya Holiday Notice',
    body: 'The office will be closed for the Hari Raya break. Please plan your leave early and submit requests by the end of the month.',
    author: 'HR',
    category: 'Holiday',
    ago: '1 day ago',
    unread: true,
    thisMonth: true,
  },
  {
    title: 'EPF Contribution Rate Update',
    body: 'The employee EPF/KWSP rate returns to 11% from the November payroll. Your payslip and PCB deductions will reflect the change automatically.',
    author: 'Finance',
    category: 'Policy',
    ago: '3 days ago',
    unread: true,
    thisMonth: true,
  },
  {
    title: 'New Dental Benefit',
    body: 'From November, every full-time employee is covered for up to RM500 per year in dental care. Claim through the usual claims flow.',
    author: 'HR',
    category: 'Benefits',
    ago: '6 days ago',
    unread: false,
    thisMonth: true,
  },
  {
    title: 'Q4 OKRs Published',
    body: 'The company and team OKRs for Q4 are now live. Review yours with your manager before the end of next week.',
    author: 'CEO',
    category: 'Strategy',
    ago: '1 week ago',
    unread: false,
    thisMonth: true,
  },
  {
    title: 'Office Renovation — Level 3',
    body: 'Level 3 will undergo renovation over the next two weeks. Affected teams will be moved to Level 2 temporarily.',
    author: 'Admin',
    category: 'General',
    ago: '2 weeks ago',
    unread: false,
    thisMonth: false,
  },
];

const CATEGORY_META: { key: string; category: Category; label: string; color: string }[] = [
  { key: 'general', category: 'General', label: 'General', color: 'var(--chart-1)' },
  { key: 'holiday', category: 'Holiday', label: 'Holiday', color: 'var(--chart-2)' },
  { key: 'benefits', category: 'Benefits', label: 'Benefits', color: 'var(--chart-3)' },
  { key: 'strategy', category: 'Strategy', label: 'Strategy', color: 'var(--chart-4)' },
  { key: 'policy', category: 'Policy', label: 'Policy', color: 'var(--chart-5)' },
];

const CATEGORY_MIX: Slice[] = CATEGORY_META.map((c) => ({
  key: c.key,
  label: c.label,
  value: POSTS.filter((p) => p.category === c.category).length,
  color: c.color,
})).filter((s) => s.value > 0);

/* KPI sparkline trends (last 6 periods) ------------------------------ */
const SPARK_ACTIVE = [3, 4, 4, 5, 6, 6];
const SPARK_MONTH = [2, 3, 4, 5, 5, 5];
const SPARK_UNREAD = [1, 2, 2, 3, 3, 3];
const SPARK_CATEGORIES = [3, 4, 4, 5, 5, 5];

const unreadCount = POSTS.filter((p) => p.unread).length;
const monthCount = POSTS.filter((p) => p.thisMonth).length;
const categoryCount = new Set(POSTS.map((p) => p.category)).size;

export default function AnnouncementsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide updates for your team, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Announcement
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Active"
            value={POSTS.length}
            delta="posted"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline data={SPARK_ACTIVE} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="This month"
            value={monthCount}
            delta="+3"
            deltaTone="up"
            chart={<Sparkline data={SPARK_MONTH} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Unread"
            value={unreadCount}
            delta="for you"
            deltaTone="down"
            chart={<Sparkline data={SPARK_UNREAD} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Categories"
            value={categoryCount}
            delta="channels"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_CATEGORIES} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* By category + feed */}
        <BentoCard
          title="By category"
          subtitle="Across all announcements"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={CATEGORY_MIX}
            height={240}
            centerValue={POSTS.length.toString()}
            centerLabel="posts"
          />
        </BentoCard>

        <BentoCard
          title="Latest announcements"
          subtitle={`${unreadCount} unread · newest first`}
          icon={Megaphone}
          action={
            <Button variant="outline" size="sm">
              <MailCheck className="size-4" />
              Mark all read
            </Button>
          }
          className="col-span-2 md:col-span-8"
        >
          <ul className="divide-y">
            {POSTS.map((p) => (
              <li key={p.title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {p.author[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {p.unread ? <LiveDot active /> : null}
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {p.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {p.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Bell className="size-3.5" />
                    <span>{p.author}</span>
                    <span aria-hidden>·</span>
                    <span>{p.ago}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
