import { formatRelativeDate, truncateText } from '@/utils/date';

describe('formatRelativeDate', () => {
  it('returns "Just now" for recent dates', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('Just now');
  });

  it('returns formatted date for old dates', () => {
    const old = new Date('2020-06-15').toISOString();
    const result = formatRelativeDate(old);
    expect(result).toMatch(/Jun/);
  });
});

describe('truncateText', () => {
  it('returns text unchanged when under limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates long text with ellipsis', () => {
    const long = 'a'.repeat(20);
    const result = truncateText(long, 10);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(11);
  });
});
