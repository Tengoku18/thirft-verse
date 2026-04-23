import Image from 'next/image';
import Link from 'next/link';

interface StoreMinimalFooterProps {
  className?: string;
}

const StoreMinimalFooter = ({ className = '' }: StoreMinimalFooterProps) => (
  <div
    className={`flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left ${className}`}
  >
    <Link
      href="/"
      className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
    >
      <Image
        src="/images/horizontal-logo.png"
        alt="Thriftverse"
        height={28}
        width={120}
        className="object-contain"
      />
    </Link>
    <p className="text-primary/50 font-sans text-[11px] sm:text-xs">
      Sustainable shopping. Delivered with care.
    </p>
  </div>
);

export default StoreMinimalFooter;
