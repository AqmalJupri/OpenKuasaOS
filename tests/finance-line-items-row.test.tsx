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

  it('counts the per-line discount as an eighth box on a sales document', () => {
    const row = rowOf(classesBefore(markup(true), 'aria-label="Line 1"', 0, 'li').classes);
    expect(row).toBeDefined();
    expect(row ? row.slice(row.indexOf('[') + 1, -1).split('_').length : 0).toBe(8);
  });

  it('gives the price box both columns on a phone, so "Supplier price" is not cut off', () => {
    const html = markup();
    expect(fieldClasses(html, 'price')).toContain('col-span-2');
    // On the wide layout each box is one track of the row, so the double span is dropped again.
    expect(fieldClasses(html, 'price')).toContain('@min-[52rem]/lines:col-span-1');
  });

  it('keeps the line cards whole on a phone: every field spans what it needs', () => {
    const html = markup(true);
    for (const name of ['product', 'description', 'discount']) {
      expect(fieldClasses(html, name)).toContain('col-span-2');
      expect(fieldClasses(html, name)).toContain('@min-[52rem]/lines:col-span-1');
    }
    for (const name of ['quantity', 'uom', 'sst']) {
      expect(fieldClasses(html, name)).not.toContain('col-span-2');
    }
  });
});
