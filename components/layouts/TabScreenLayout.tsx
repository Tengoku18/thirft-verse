import { TabHeader, TabHeaderVariant } from "@/components/navigation/TabHeader";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabScreenLayoutProps {
  // ── Header ──────────────────────────────────────────────────
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showDefaultIcons?: boolean;
  showHeader?: boolean;
  showTextLogo?: boolean;
  statusBarColor?: string;
  /** "dark" = espresso header (home). "light" = cream header for sub-screens. */
  headerVariant?: TabHeaderVariant;

  // ── Sticky section (sits between header and scroll area) ────
  stickyComponent?: React.ReactNode;

  // ── Scroll / content ────────────────────────────────────────
  /**
   * Wrap children in a built-in ScrollView.
   * Default: true. Set to false only for screens that manage their own scroll.
   */
  scrollable?: boolean;
  /**
   * Pull-to-refresh callback. Layout manages the `refreshing` boolean internally.
   * Only meaningful when `scrollable` is true.
   */
  onRefresh?: () => void | Promise<void>;
  /** Content area background color. Default: "#FAF7F2" (brand off-white). */
  backgroundColor?: string;
  /**
   * Extra style merged into the ScrollView's `contentContainerStyle`.
   * The layout always adds `paddingBottom: tabBarPadding`; this prop adds
   * whatever else the screen needs (padding, gap, etc.).
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Bottom padding reserved for the floating tab bar.
   * Default: 130 (72 px bar height + ~20 px safe area + buffer).
   */
  tabBarPadding?: number;
  /**
   * Wrap the scroll/content area in a KeyboardAvoidingView.
   * Default: true — needed for screens with text inputs.
   */
  keyboardAvoiding?: boolean;

  children: React.ReactNode;
}

export function TabScreenLayout({
  // Header
  title,
  showBackButton = false,
  onBack,
  rightComponent,
  showDefaultIcons = true,
  showHeader = true,
  showTextLogo = false,
  statusBarColor,
  headerVariant = "dark",

  // Sticky
  stickyComponent,

  // Scroll / content
  scrollable = true,
  onRefresh,
  backgroundColor = "#FAF7F2",
  contentContainerStyle,
  tabBarPadding = 130,
  keyboardAvoiding = true,

  children,
}: TabScreenLayoutProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  // ── Safe area background ──────────────────────────────────
  const isLight = headerVariant === "light";
  const safeAreaBgColor =
    statusBarColor ??
    (showHeader ? (isLight ? "#FAF7F2" : "#3B2F2F") : "#FAF7F2");

  const isDarkBackground =
    safeAreaBgColor === "#3B2F2F" ||
    safeAreaBgColor.toLowerCase() === "#000000";

  // ── Content area ──────────────────────────────────────────
  const contentArea = scrollable ? (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        { paddingBottom: tabBarPadding },
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B2F2F"
            colors={["#3B2F2F"]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, backgroundColor }}>{children}</View>
  );

  // ── Keyboard avoidance wrapper ────────────────────────────
  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {contentArea}
    </KeyboardAvoidingView>
  ) : (
    contentArea
  );

  // ── Root ──────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: safeAreaBgColor }}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDarkBackground ? "light-content" : "dark-content"}
      />

      {showHeader && (
        <TabHeader
          variant={headerVariant}
          title={title}
          showBackButton={showBackButton}
          onBack={onBack}
          rightComponent={rightComponent}
          showDefaultIcons={showDefaultIcons}
          showTextLogo={showTextLogo}
        />
      )}

      {stickyComponent && (
        <View style={{ backgroundColor: safeAreaBgColor }}>
          {stickyComponent}
        </View>
      )}

      {wrappedContent}
    </SafeAreaView>
  );
}
