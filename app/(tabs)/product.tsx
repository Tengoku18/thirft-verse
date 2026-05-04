import { AddProductForm } from "@/components/add-product";
import { useTour } from "@/contexts/TourContext";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

export default function ProductScreen() {
  const { isActive, currentStep, registerTarget, measureAndSetSpotlight } =
    useTour();
  const formRef = useRef<View>(null);

  useEffect(() => {
    registerTarget("product_form", formRef);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    useCallback(() => {
      if (isActive && currentStep?.key === "product_form") {
        measureAndSetSpotlight("product_form");
      }
    }, [isActive, currentStep, measureAndSetSpotlight]),
  );

  return (
    <View ref={formRef} collapsable={false} style={{ flex: 1 }}>
      <AddProductForm />
    </View>
  );
}
