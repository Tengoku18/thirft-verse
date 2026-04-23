'use client';

import { copyToClipboard } from '@/utils/clipboard';
import { Check, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface StoreShareActionsProps {
  storeName: string;
  storeUrl: string;
  bio?: string | null;
}

const StoreShareActions = ({
  storeName,
  storeUrl,
  bio,
}: StoreShareActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(storeUrl);
    if (ok) {
      setCopied(true);
      toast.success('Store link copied', {
        duration: 1800,
        position: 'bottom-center',
      });
      setTimeout(() => setCopied(false), 1800);
    } else {
      toast.error('Could not copy link', {
        duration: 1800,
        position: 'bottom-center',
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: storeName,
      text: bio ? `Shop ${storeName} on Thriftverse — ${bio}` : `Shop ${storeName} on Thriftverse`,
      url: storeUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user dismissed or share failed; fall through to copy
      }
    }
    void handleCopy();
  };

  const prettyUrl = storeUrl.replace(/^https?:\/\//, '');

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="group border-border/70 bg-surface text-primary/85 hover:border-primary/40 hover:text-primary inline-flex min-w-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 font-sans text-xs font-semibold tracking-wide transition-colors sm:gap-2 sm:px-4"
        aria-label={copied ? 'Store link copied' : `Copy store link ${prettyUrl}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
        ) : (
          <Link2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        )}
        <span className="truncate">
          {copied ? (
            'Link copied'
          ) : (
            <>
              <span className="sm:hidden">Copy link</span>
              <span className="hidden max-w-[220px] truncate sm:inline-block">
                {prettyUrl}
              </span>
            </>
          )}
        </span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="bg-primary text-surface hover:bg-primary/90 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-sans text-xs font-semibold tracking-wide shadow-sm transition-colors sm:gap-2 sm:px-4"
        aria-label="Share this store"
      >
        <Share2 className="h-3.5 w-3.5" strokeWidth={2.5} />
        Share
      </button>
    </>
  );
};

export default StoreShareActions;
