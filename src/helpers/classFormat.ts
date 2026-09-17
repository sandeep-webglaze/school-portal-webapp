/**
 * formatClassLabel — convert a stored class value into a human-readable label.
 *
 * Stored values can be:
 *   - "Nursery" / "LKG" / "UKG"   → display as-is
 *   - "1" through "12"             → display as "Class 1" … "Class 12"
 *   - undefined / empty            → display "—"
 *
 * Used in school cards (FeaturedSchools, Schools list) and detail pages so
 * pre-primary entries don't render as awkward "Class Nursery".
 */
export function formatClassLabel(value?: string | null): string {
  if (!value) return '—';
  const trimmed = String(value).trim();
  if (!trimmed) return '—';

  // Pre-primary values are stored under their human-readable names.
  // Anything non-numeric is shown verbatim.
  if (/^\d+$/.test(trimmed)) {
    return `Class ${trimmed}`;
  }
  return trimmed;
}

/**
 * formatClassRange — "Class 1 - Class 12", "Nursery - UKG", "Nursery - Class 5".
 * Both ends format independently so mixed ranges render correctly.
 */
export function formatClassRange(
  from?: string | null,
  to?: string | null,
): string {
  return `${formatClassLabel(from)} - ${formatClassLabel(to)}`;
}

/**
 * Canonical list of class values for enquiry/contact forms so parents can
 * choose pre-primary admission targets too.
 */
export const SCHOOL_CLASS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Nursery', value: 'Nursery' },
  { label: 'LKG', value: 'LKG' },
  { label: 'UKG', value: 'UKG' },
  ...Array.from({ length: 12 }, (_, idx) => ({
    label: `Class ${idx + 1}`,
    value: String(idx + 1),
  })),
];
