'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const APP_STORE_URL = 'https://apps.apple.com/np/app/thriftverse/id6758267809';
const PLAY_STORE_URL = 'https://play.google.com/store/apps'; // Update this when you have the actual Play Store URL

type Platform = 'ios' | 'android' | 'unknown';

export default function AppDownloadQR() {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Detect iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    }
    // Detect Android
    else if (/android/i.test(userAgent)) {
      setPlatform('android');
    }
    // Default to iOS for desktop/unknown
    else {
      setPlatform('ios');
    }
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-lg">
        <div className="h-full w-full animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  const appUrl = platform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
  const platformLabel = platform === 'android' ? 'Android' : 'iOS';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-lg">
        <QRCode
          value={appUrl}
          size={176}
          level="M"
          className="h-full w-full"
        />
      </div>
      <p className="text-sm font-medium text-primary">
        Scan to Download
        {platform !== 'unknown' && (
          <span className="ml-1 text-xs text-primary/60">({platformLabel})</span>
        )}
      </p>
    </div>
  );
}
