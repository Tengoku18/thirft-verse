import { HeadingBoldText } from "@/components/Typography";
import NotificationIcon from "@/components/icons/NotificationIcon";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { LOGOS } from "@/constants/logos";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StatusBar, TouchableOpacity, View, ViewStyle } from "react-native";

export type TabHeaderVariant = "dark" | "light";

interface TabHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showDefaultIcons?: boolean;
  showTextLogo?: boolean;
  variant?: TabHeaderVariant;
}

// ─── Shared style for all icon buttons in the light tab header ───
export const TAB_ICON_BTN_STYLE: ViewStyle = {
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "rgba(59,47,47,0.06)",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
};

// ─── Shared unread badge ───
function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 5,
        right: 5,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#EF4444",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
      }}
    >
      <Typography variation="body-xs" style={{ color: "#FFFFFF", fontSize: 9, lineHeight: 12 }}>
        {count > 99 ? "99+" : count}
      </Typography>
    </View>
  );
}

// ─── Light variant ─── cream header: title + notification + optional right ───
function LightTabHeader({
  title,
  rightComponent,
}: Pick<TabHeaderProps, "title" | "rightComponent">) {
  const router = useRouter();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  return (
    <View
      style={{
        backgroundColor: "#FAF7F2",
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(59,48,48,0.07)",
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Title */}
      <HeadingBoldText style={{ fontSize: 20, color: "#3B2F2F", letterSpacing: -0.3 }}>
        {title ?? ""}
      </HeadingBoldText>

      {/* Right — notification + optional custom icon(s) */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableOpacity
          onPress={() => router.push("/notifications" as never)}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={TAB_ICON_BTN_STYLE}
        >
          <NotificationIcon width={20} height={20} fill="#3B2F2F" />
          <UnreadBadge count={unreadCount} />
        </TouchableOpacity>

        {rightComponent}
      </View>
    </View>
  );
}

// ─── Dark variant ─── espresso header (home screen) ───
function DarkTabHeader({
  title,
  showBackButton,
  onBack,
  rightComponent,
  showDefaultIcons,
  showTextLogo,
}: Omit<TabHeaderProps, "variant">) {
  const router = useRouter();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="px-4 pb-4" style={{ backgroundColor: "#3B2F2F" }}>
      <StatusBar barStyle="light-content" backgroundColor="#3B2F2F" />
      <View className="flex-row items-center justify-between h-10">
        {/* Left */}
        <View className="flex-row items-center">
          {showBackButton ? (
            <>
              <TouchableOpacity
                onPress={handleBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <IconSymbol name="chevron.left" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              {title && (
                <HeadingBoldText style={{ fontSize: 18, color: "#FFFFFF" }}>
                  {title}
                </HeadingBoldText>
              )}
            </>
          ) : showTextLogo ? (
            <Image
              source={LOGOS.text}
              style={{ width: 120, height: 32 }}
              resizeMode="contain"
            />
          ) : (
            <View className="flex-row items-center">
              <Image
                source={LOGOS.icon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <HeadingBoldText style={{ fontSize: 20, color: "#FFFFFF", marginLeft: 10 }}>
                {title || "ThriftVerse"}
              </HeadingBoldText>
            </View>
          )}
        </View>

        {/* Right */}
        <View className="flex-row items-center" style={{ gap: 16 }}>
          {rightComponent ? (
            rightComponent
          ) : showDefaultIcons ? (
            <>
              <TouchableOpacity
                onPress={() => router.push("/explore")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <IconSymbol name="magnifyingglass" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/notifications" as never)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <View>
                  <IconSymbol name="bell.fill" size={24} color="#FFFFFF" />
                  {unreadCount > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "#EF4444",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Typography variation="body-xs" style={{ color: "#FFFFFF", fontSize: 10, lineHeight: 14 }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Typography>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                className="rounded-full items-center justify-center"
              >
                <IconSymbol name="gearshape.fill" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ─── Public component ───
export function TabHeader({
  variant = "dark",
  title,
  showBackButton,
  onBack,
  rightComponent,
  showDefaultIcons = true,
  showTextLogo = false,
}: TabHeaderProps) {
  if (variant === "light") {
    return <LightTabHeader title={title} rightComponent={rightComponent} />;
  }

  return (
    <DarkTabHeader
      title={title}
      showBackButton={showBackButton}
      onBack={onBack}
      rightComponent={rightComponent}
      showDefaultIcons={showDefaultIcons}
      showTextLogo={showTextLogo}
    />
  );
}
