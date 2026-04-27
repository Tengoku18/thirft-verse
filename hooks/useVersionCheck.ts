import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

const IOS_BUNDLE_ID = "com.thriftverse.app";
const ANDROID_PACKAGE_ID = "com.thriftverse.app";

// Returns true if current version is strictly less than store version
function isOutdated(current: string, store: string): boolean {
  const c = current.split(".").map(Number);
  const s = store.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const cv = c[i] ?? 0;
    const sv = s[i] ?? 0;
    if (cv > sv) return false;
    if (cv < sv) return true;
  }
  return false;
}

async function fetchAppStoreVersion(): Promise<string | null> {
  const res = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}&country=us`,
  );
  const json = await res.json();
  return json?.results?.[0]?.version ?? null;
}

async function fetchPlayStoreVersion(): Promise<string | null> {
  const res = await fetch(
    `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}&hl=en`,
  );
  const html = await res.text();
  const match = html.match(/\[\[\["(\d+\.\d+(?:\.\d+)*)"\]\]/);
  return match?.[1] ?? null;
}

/**
 * @param enabled - set false to defer the check until the app is fully ready
 *   (fonts loaded + OTA settled). Flipping to true starts the API call.
 */
export function useVersionCheck(enabled = true) {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    async function check() {
      try {
        const storeVersion =
          Platform.OS === "ios"
            ? await fetchAppStoreVersion()
            : await fetchPlayStoreVersion();

        if (!storeVersion) return;

        // Use the native binary version — this is what the store actually tracks.
        // Constants.expoConfig?.version reflects the JS bundle (can drift via OTA),
        // while nativeApplicationVersion always matches what iTunes/Play Store shows.
        const currentVersion = Application.nativeApplicationVersion;
        if (!currentVersion) return;

        console.log("[VersionCheck] current:", currentVersion, "store:", storeVersion);

        setNeedsUpdate(isOutdated(currentVersion, storeVersion));
      } catch (error) {
        console.error("[VersionCheck] error:", error);
        // Fail silently — never block the app if the check fails
      } finally {
        setIsChecking(false);
      }
    }

    check();
  }, [enabled]);

  return { needsUpdate, isChecking };
}
