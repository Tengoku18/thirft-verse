import Constants from "expo-constants";
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
  // Official Apple iTunes Lookup API — returns the current live App Store version
  const res = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}&country=us`,
  );
  const json = await res.json();
  return json?.results?.[0]?.version ?? null;
}

async function fetchPlayStoreVersion(): Promise<string | null> {
  // Google has no public API — fetch the Play Store HTML and extract the version
  const res = await fetch(
    `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}&hl=en`,
  );
  const html = await res.text();

  // The Play Store embeds version data as JSON arrays in its page source
  // Pattern: [[["1.2.3"]]] nested inside script data
  const match = html.match(/\[\[\["(\d+\.\d+(?:\.\d+)*)"\]\]/);
  return match?.[1] ?? null;
}

export function useVersionCheck() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [storeVersion, setStoreVersion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const latestVersion =
          Platform.OS === "ios"
            ? await fetchAppStoreVersion()
            : await fetchPlayStoreVersion();

        console.log("latestVersion", Platform.OS, latestVersion);

        if (!latestVersion) return;

        const current = Constants.expoConfig?.version ?? "0.0.0";
        setStoreVersion(latestVersion);
        console.log(
          "isOutdated(current, latestVersion)---->",
          current,
          latestVersion,
          isOutdated(current, latestVersion),
        );

        setNeedsUpdate(isOutdated(current, latestVersion));
      } catch (error) {
        console.error("Error checking version:", error);
        // Fail silently — never block the app if the version check fails
      } finally {
        setIsChecking(false);
      }
    }

    check();
  }, []);

  return { needsUpdate, storeVersion, isChecking };
}
