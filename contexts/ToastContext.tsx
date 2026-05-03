import {
  CheckMarkCircleIcon,
  WarningFillIcon,
  XCircleFillIcon,
} from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  title?: string;
}

interface ToastContextType {
  show: (config: ToastConfig | string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    bg: "#3B2F2F",
    iconColor: "#4ADE80",
    icon: <CheckMarkCircleIcon width={22} height={22} color="#4ADE80" />,
  },
  error: {
    bg: "#DC2626",
    iconColor: "#FFFFFF",
    icon: <XCircleFillIcon width={22} height={22} color="#FFFFFF" />,
  },
  warning: {
    bg: "#F59E0B",
    iconColor: "#FFFFFF",
    icon: <WarningFillIcon width={22} height={22} color="#FFFFFF" />,
  },
  info: {
    bg: "#3B82F6",
    iconColor: "#FFFFFF",
    icon: <CheckMarkCircleIcon width={22} height={22} color="#FFFFFF" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [toastData, setToastData] = useState<{
    message: string;
    type: ToastType;
    title?: string;
  }>({
    message: "",
    type: "success",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [fadeAnim, translateY]);

  const show = useCallback(
    (config: ToastConfig | string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const toastConfig =
        typeof config === "string"
          ? { message: config, type: "success" as ToastType, duration: 3000 }
          : { type: "success" as ToastType, duration: 3000, ...config };

      setToastData({
        message: toastConfig.message,
        type: toastConfig.type,
        title: toastConfig.title,
      });
      setVisible(true);

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      timeoutRef.current = setTimeout(() => {
        hide();
      }, toastConfig.duration);
    },
    [fadeAnim, translateY, hide],
  );

  const success = useCallback(
    (message: string, title?: string) => {
      show({ message, type: "success", title });
    },
    [show],
  );

  const error = useCallback(
    (message: string, title?: string) => {
      show({ message, type: "error", title, duration: 4000 });
    },
    [show],
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      show({ message, type: "warning", title });
    },
    [show],
  );

  const info = useCallback(
    (message: string, title?: string) => {
      show({ message, type: "info", title });
    },
    [show],
  );

  const config = toastConfig[toastData.type];

  return (
    <ToastContext.Provider
      value={{ show, success, error, warning, info, hide }}
    >
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            {
              top: insets.top + 10,
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={[styles.toast, { backgroundColor: config.bg }]}>
            <View style={styles.iconContainer}>{config.icon}</View>
            <View style={styles.content}>
              {toastData.title && (
                <Typography
                  variation="body-sm"
                  style={[styles.title, { fontWeight: "600" }]}
                >
                  {toastData.title}
                </Typography>
              )}
              <Typography
                variation="body-sm"
                style={[styles.message, !toastData.title && styles.messageOnly]}
                numberOfLines={2}
              >
                {toastData.message}
              </Typography>
            </View>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    maxWidth: 400,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 2,
  },
  message: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  messageOnly: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});
