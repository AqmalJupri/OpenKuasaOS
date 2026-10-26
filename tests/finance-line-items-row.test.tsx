import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LineItemsEditor } from '@/components/finance/line-items-editor';
import { emptyLine } from '@/lib/finance/document-form';

// A closed select draws nothing but its trigger, and Radix reads the DOM; the markup is all this file needs.
vi.mock('@/components/ui/select', () => {
  const Pass = ({ children }: { children?: ReactNode }) => <>{children}</>;
  return {
    Select: Pass,
    SelectTrigger: Pass,
    SelectValue: () => null,
    SelectContent: Pass,
    SelectItem: Pass,
  };
});

/**
 * A line is one row of seven boxes on a bill, invoice, quotation or RFQ, or eight when it carries a
 * per-line discount. Which layout it takes must follow the width of the form it sits in, not the
 * width of the screen: the menu beside the form takes about 250px, so a tablet screen leaves the
 * form far too narrow for one row (issue #396). These checks read the classes; the sizes they
 * produce are measured in the pull request's screenshots.
 */
const markup = (discount = false) =>
  renderToStaticMarkup(
    <LineItemsEditor
      lines={[emptyLine('k1')]}
      products={[]}
      withProduct={(line) => line}
      pricePlaceholder="Supplier price"
      discount={discount}
      onChange={() => {}}
    />,
  );

/** The classes on the first tag before `needle` that carries a class attribute. */
const classesBefore = (html: string, needle: string, from = 0, tag = '[a-z]+') => {
  const chunks = html.split('<');
  const at = chunks.findIndex((chunk, index) => index > from && chunk.includes(needle));
  if (at === -1) throw new Error(`no ${needle} in the markup`);
  for (let i = at; i >= 0; i -= 1) {
    const found = chunks[i].match(new RegExp(`^${tag}[^>]*\\sclass="([^"]*)"`));
    if (found) return { classes: found[1].split(/\s+/).filter(Boolean), at: i };
  }
  throw new Error(`no class before ${needle}`);
};

/** The box a field's label and input sit in, found by the label's `for`. */
const fieldClasses = (html: string, name: string) => {
  const label = classesBefore(html, `-k1-${name}"`, 0, 'label');
  return classesBefore(html, '', label.at - 1, 'div').classes;
};

const rowOf = (classes: string[]) => classes.find((c) => c.includes('grid-cols-') && c.includes('minmax'));

describe('a line of a document', () => {
  it('switches to one row on the form’s own width, not the screen’s', () => {
    const html = markup();
    const rows = classesBefore(html, 'aria-label="Line 1"', 0, 'li').classes.filter((c) => c.startsWith('md:'));
    expect(rows).toEqual([]);
    // The editor is the container the row is measured against.
    expect(classesBefore(html, 'space-y-3', 0, 'div').classes).toContain('@container/lines');
    // Seven boxes, so the row is seven tracks; the price track may not shrink below its placeholder.
    const row = rowOf(classesBefore(html, 'aria-label="Line 1"', 0, 'li').classes);
    expect(row).toBeDefined();
    expect(row?.slice(row.indexOf('[') + 1, -1).split('_').length).toBe(7);
    expect(row).toContain('minmax(8.5rem,2fr)');
  });

  it('puts the eight boxes on one row only where the description fits', () => {
    // The eight floors (5, 11.5, 3.5, 3.5, 8.5, 3.5, 7.5, 7.5rem) plus the seven 0.5rem gaps are
    // exactly 54rem, so that is the earliest form width where every box can keep its own text: the
    // description gets 162px of room for the 160px "Arabica beans, roasted" in Lexend, and the
    // discount input 40px for the 26px "12.5" beside its unit select. Below 54rem the line stays a
    // card, which is the whole point of the change.
    const row = rowOf(classesBefore(markup(true), 'aria-label="Line 1"', 0, 'li').classes);
    expect(row?.startsWith('@min-[54rem]/lines:')).toBe(true);
  });

  it('switches every part of the line at that same width', () => {
    // A label or a box that changes at a different width than the row it sits in would leave a line
    // with eight boxes and seven labels, or the row at one width and its spacing at another.
    const widths = [...`${markup()}${markup(true)}`.matchAll(/@min-\[([\d.]+)rem\]\/lines/g)].map((match) => match[1]);
    expect(new Set(widths)).toEqual(new Set(['54']));
  });

  it('counts the per-line discount as an eighth box on a sales document', () => {
    const row = rowOf(classesBefore(markup(true), 'aria-label="Line 1"', 0, 'li').classes);
    expect(row).toBeDefined();
    expect(row ? row.slice(row.indexOf('[') + 1, -1).split('_').length : 0).toBe(8);
  });

  it('keeps the discount box wide enough for the value beside its unit select', () => {
    // The discount box holds an input and a 64px unit select with a 4px gap, so the track has to
    // hold all three. Without a floor the track took 2fr of what was left: at 54rem that left the
    // input 16px of text room and "12.5" needs 26px in Lexend, the app's face. Measured in
    // Chromium, the input was cut at 864px (16px of room), 880px (20px) and 895px (24px) of form
    // width, and only cleared the value at 928px. 7.5rem gives the input 40px.
    const row = rowOf(classesBefore(markup(true), 'aria-label="Line 1"', 0, 'li').classes);
    const tracks = row?.slice(row.indexOf('[') + 1, -1).split('_') ?? [];
    // Tracks in order: product, description, qty, unit, price, sst, discount, amount.
    expect(tracks[6]).toBe('minmax(7.5rem,2fr)');
  });

  it('keeps room for the amount beside the remove button', () => {
    // The amount shares its box with a 32px remove button and the 8px gap, so a five-figure
    // total needs a floor of its own or it truncates ("RM 222.00" needs 75px of text).
    for (const html of [markup(), markup(true)]) {
      const row = rowOf(classesBefore(html, 'aria-label="Line 1"', 0, 'li').classes);
      expect(row?.endsWith('minmax(7.5rem,2fr)]')).toBe(true);
    }
  });

  it('gives the description more of the free width than the discount box beside it', () => {
    // The description is the only free-text box in the line: "Arabica beans, roasted" needs 161px.
    // Eight boxes still have to fit, but the description must not end up the narrowest of them.
    const row = rowOf(classesBefore(markup(true), 'aria-label="Line 1"', 0, 'li').classes);
    const fr = (track: string) => Number(track.match(/,([\d.]+)fr\)$/)?.[1] ?? 0);
    const tracks = row?.slice(row.indexOf('[') + 1, -1).split('_') ?? [];
    // Tracks in order: product, description, qty, unit, price, sst, discount, amount.
    expect(fr(tracks[1] ?? '')).toBeGreaterThan(fr(tracks[6] ?? ''));
  });

  it('gives the price box both columns on a phone, so "Supplier price" is not cut off', () => {
    const html = markup();
    expect(fieldClasses(html, 'price')).toContain('col-span-2');
    // On the wide layout each box is one track of the row, so the double span is dropped again.
    expect(fieldClasses(html, 'price')).toContain('@min-[54rem]/lines:col-span-1');
  });

  it('keeps the line cards whole on a phone: every field spans what it needs', () => {
    const html = markup(true);
    for (const name of ['product', 'description', 'discount']) {
      expect(fieldClasses(html, name)).toContain('col-span-2');
      expect(fieldClasses(html, name)).toContain('@min-[54rem]/lines:col-span-1');
    }
    for (const name of ['quantity', 'uom', 'sst']) {
      expect(fieldClasses(html, name)).not.toContain('col-span-2');
    }
  });
});
