import * as Application from "expo-application";
import { useCallback, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

export interface AppUpdateState {
  currentVersion: string;
  latestVersion: string;
  isVisible: boolean;
  openStore: () => Promise<void>;
}

const IOS_BUNDLE_ID = "com.thriftverse.app";
const ANDROID_PACKAGE_ID = "com.thriftverse.app";
const CHECK_TIMEOUT_MS = 6000;

const STORE_URLS = Platform.select({
  ios: {
    native: "itms-apps://itunes.apple.com/np/app/thriftverse/id6758267809",
    web: "https://apps.apple.com/np/app/thriftverse/id6758267809",
  },
  android: {
    native: "market://details?id=com.thriftverse.app",
    web: "https://play.google.com/store/apps/details?id=com.thriftverse.app",
  },
  default: {
    native: "https://apps.apple.com/np/app/thriftverse/id6758267809",
    web: "https://apps.apple.com/np/app/thriftverse/id6758267809",
  },
})!;

// Semantic comparison: returns -1 if a < b, 0 if equal, 1 if a > b
// Handles multi-part versions correctly: 1.10.0 > 1.2.0
function compareVersions(a: string, b: string): number {
  const ap = a.split(".").map(Number);
  const bp = b.split(".").map(Number);
  const len = Math.max(ap.length, bp.length);
  for (let i = 0; i < len; i++) {
    const av = ap[i] ?? 0;
    const bv = bp[i] ?? 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
  }
  return 0;
}

async function fetchStoreVersion(): Promise<string | null> {
  const timeout = new Promise<null>((r) =>
    setTimeout(() => r(null), CHECK_TIMEOUT_MS),
  );

  const fetchVersion = (async (): Promise<string | null> => {
    if (Platform.OS === "ios") {
      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}&country=us`,
      );
      const json = await res.json();
      return json?.results?.[0]?.version ?? null;
    } else {
      const res = await fetch(
        `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}&hl=en`,
      );
      const html = await res.text();
      const match = html.match(/\[\[\["(\d+\.\d+(?:\.\d+)*)"\]\]/);
      return match?.[1] ?? null;
    }
  })();

  return Promise.race([fetchVersion, timeout]);
}

export function useAppUpdate(enabled = true): AppUpdateState {
  const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

  const [latestVersion, setLatestVersion] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      try {
        const storeVersion = await fetchStoreVersion();

        // If offline or store fetch failed, fail silently — never block the app
        if (!storeVersion || cancelled) return;

        setLatestVersion(storeVersion);

        if (!cancelled) {
          setIsVisible(compareVersions(currentVersion, storeVersion) < 0);
        }
      } catch (err) {
        console.error("❌ [AppUpdate] Check failed:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const openStore = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(STORE_URLS.native);
      await Linking.openURL(canOpen ? STORE_URLS.native : STORE_URLS.web);
    } catch {
      try {
        await Linking.openURL(STORE_URLS.web);
      } catch (fallbackErr) {
        console.error("❌ [AppUpdate] Failed to open store:", fallbackErr);
      }
    }
  }, []);

  return {
    currentVersion,
    latestVersion,
    isVisible,
    openStore,
  };
}
