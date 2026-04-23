interface SectionDividerProps {
  /**
   * Vertical breathing room. `md` is the default used between major sections;
   * `sm` is suitable for tighter transitions (e.g. inside the footer area).
   */
  spacing?: 'sm' | 'md';
}

const spacingMap: Record<NonNullable<SectionDividerProps['spacing']>, string> = {
  sm: 'py-5 sm:py-6',
  md: 'py-8 sm:py-10',
};

const SectionDivider = ({ spacing = 'md' }: SectionDividerProps) => (
  <div
    aria-hidden
    role="presentation"
    className={`bg-background relative flex items-center justify-center ${spacingMap[spacing]}`}
  >
    {/* Edge-to-edge hairline that fades at both ends */}
    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-border to-transparent" />

    {/* Ornament cluster – the bg-background 'cuts' the hairline behind it */}
    <div className="bg-background relative flex items-center gap-2.5 px-5">
      <span
        className="bg-secondary/60 inline-block h-1 w-1 rounded-full"
        style={{ boxShadow: '0 0 0 2px var(--color-background)' }}
      />
      <span
        className="border-secondary/70 inline-block h-2 w-2 rotate-45 border bg-background"
        style={{ boxShadow: '0 0 0 2px var(--color-background)' }}
      />
      <span
        className="bg-secondary/60 inline-block h-1 w-1 rounded-full"
        style={{ boxShadow: '0 0 0 2px var(--color-background)' }}
      />
    </div>
  </div>
);

export default SectionDivider;
