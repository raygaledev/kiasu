import { cn, generateSlug, getInitials } from '@/lib/utils';

describe('generateSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('strips leading and trailing hyphens', () => {
    expect(generateSlug(' Hello World ')).toBe('hello-world');
  });

  it('returns empty string for empty input', () => {
    expect(generateSlug('')).toBe('');
  });

  it('returns empty string for special chars only', () => {
    expect(generateSlug('!!!@@@###')).toBe('');
  });

  it('collapses multiple separators into one hyphen', () => {
    expect(generateSlug('hello   world---test')).toBe('hello-world-test');
  });
});

describe('getInitials', () => {
  it('extracts initials from two words', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single word', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });

  it('handles extra spaces', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });

  it('caps at 2 initials', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });
});

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles falsy values', () => {
    expect(cn('px-2', false && 'py-1', undefined, null)).toBe('px-2');
  });
});
