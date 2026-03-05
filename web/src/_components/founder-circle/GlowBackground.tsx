export default function GlowBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.28), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-32 h-[420px] w-[420px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(203,153,126,0.18), transparent 70%)' }}
      />
      <div
        className="absolute -top-16 -right-24 h-[320px] w-[320px] rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.12), transparent 70%)' }}
      />
    </div>
  );
}
