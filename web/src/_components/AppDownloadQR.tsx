'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const APP_STORE_URL = 'https://apps.apple.com/np/app/thriftverse/id6758267809';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.thriftverse.app';

type Platform = 'ios' | 'android' | 'unknown';

interface AppDownloadQRProps {
  store?: 'ios' | 'android';
}

export default function AppDownloadQR({ store }: AppDownloadQRProps = {}) {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (store) return;
    setMounted(true);
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('ios');
    }
  }, [store]);

  useEffect(() => {
    if (store) setMounted(true);
  }, [store]);

  if (!mounted) {
    return (
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-lg">
        <div className="h-full w-full animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  const resolvedPlatform = store ?? (platform === 'unknown' ? 'ios' : platform);
  const appUrl = resolvedPlatform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
  const platformLabel = resolvedPlatform === 'android' ? 'Android' : 'iOS';

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
        <span className="ml-1 text-xs text-primary/60">({platformLabel})</span>
      </p>
    </div>
  );
}
