import { TOUR_STEPS, TourStep, TourStepKey } from "@/constants/tourSteps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { InteractionManager, View } from "react-native";

const TOUR_SEEN_KEY = "@thriftverse:tour_seen";

export const TOUR_TIMING = {
  INITIAL_MOUNT_MS: 800, // home tab needs to fully mount after auth redirect
  CROSS_TAB_NAV_MS: 600, // tab navigation animation settles
  SAME_TAB_STEP_MS: 100, // same-tab state update propagates
} as const;

interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourContextType {
  isActive: boolean;
  currentStep: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  spotlightRect: SpotlightRect | null;
  isTransitioning: boolean;
  startTour: () => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  registerTarget: (key: TourStepKey, ref: React.RefObject<View | null>) => void;
  measureAndSetSpotlight: (key: TourStepKey) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const targetRefs = useRef<Map<TourStepKey, React.RefObject<View | null>>>(
    new Map(),
  );
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = isActive ? (TOUR_STEPS[stepIndex] ?? null) : null;

  const scheduleTransitionEnd = useCallback((delay: number) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      transitionTimerRef.current = null;
      setIsTransitioning(false);
    }, delay);
  }, []);

  const endTour = useCallback(async () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    await AsyncStorage.setItem(TOUR_SEEN_KEY, "true");
    setIsActive(false);
    setStepIndex(0);
    setSpotlightRect(null);
    setIsTransitioning(false);
  }, []);

  const measureFromRef = useCallback((key: TourStepKey) => {
    const ref = targetRefs.current.get(key);
    if (!ref?.current) return;
    InteractionManager.runAfterInteractions(() => {
      ref.current?.measureInWindow((x, y, w, h) => {
        if (w > 0 && h > 0) {
          setSpotlightRect({ x, y, width: w, height: h });
        }
      });
    });
  }, []);

  const startTour = useCallback(async () => {
    const seen = await AsyncStorage.getItem(TOUR_SEEN_KEY);
    if (seen === "true") return;
    setIsActive(true);
    setStepIndex(0);
    setSpotlightRect(null);
    scheduleTransitionEnd(TOUR_TIMING.INITIAL_MOUNT_MS);
  }, [scheduleTransitionEnd]);

  const nextStep = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex >= TOUR_STEPS.length) {
      endTour();
      return;
    }
    const current = TOUR_STEPS[stepIndex];
    const next = TOUR_STEPS[nextIndex];
    setSpotlightRect(null);
    setStepIndex(nextIndex);

    if (next.tabRoute !== current.tabRoute) {
      scheduleTransitionEnd(TOUR_TIMING.CROSS_TAB_NAV_MS);
      router.navigate(next.tabRoute as any);
    } else {
      // Same tab — tab's own useEffect handles measurement reactively
      scheduleTransitionEnd(TOUR_TIMING.SAME_TAB_STEP_MS);
    }
  }, [stepIndex, endTour, scheduleTransitionEnd]);

  const prevStep = useCallback(() => {
    if (stepIndex <= 0) return;
    const prevIndex = stepIndex - 1;
    const current = TOUR_STEPS[stepIndex];
    const prev = TOUR_STEPS[prevIndex];
    setSpotlightRect(null);
    setStepIndex(prevIndex);

    if (prev.tabRoute !== current.tabRoute) {
      scheduleTransitionEnd(TOUR_TIMING.CROSS_TAB_NAV_MS);
      router.navigate(prev.tabRoute as any);
    } else {
      // Same tab — tab's own useEffect handles measurement reactively
      scheduleTransitionEnd(TOUR_TIMING.SAME_TAB_STEP_MS);
    }
  }, [stepIndex, scheduleTransitionEnd]);

  const registerTarget = useCallback(
    (key: TourStepKey, ref: React.RefObject<View | null>) => {
      targetRefs.current.set(key, ref);
    },
    [],
  );

  const measureAndSetSpotlight = useCallback(
    (key: TourStepKey) => {
      if (!isActive || isTransitioning) return;
      if (TOUR_STEPS[stepIndex]?.key !== key) return;
      measureFromRef(key);
    },
    [isActive, isTransitioning, stepIndex, measureFromRef],
  );

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        stepIndex,
        totalSteps: TOUR_STEPS.length,
        spotlightRect,
        isTransitioning,
        startTour,
        nextStep,
        prevStep,
        skipTour: () => {
          endTour();
        },
        registerTarget,
        measureAndSetSpotlight,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
