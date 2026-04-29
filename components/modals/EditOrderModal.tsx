import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import React from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, View } from "react-native";
import { EditOrderAddressForm } from "./edit-order/EditOrderAddressForm";
import { EditOrderBuyerForm } from "./edit-order/EditOrderBuyerForm";
import { EditOrderHeader } from "./edit-order/EditOrderHeader";
import { EditOrderNotes } from "./edit-order/EditOrderNotes";
import { OrderInitialData, useEditOrderForm } from "./edit-order/useEditOrderForm";
import { WarningFillIcon } from "@/components/icons";

export interface EditOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: string;
  initialData: OrderInitialData;
}

export function EditOrderModal({
  visible, onClose, onSuccess, orderId, initialData,
}: EditOrderModalProps) {
  const { fields, setters, errors, submitting, handleSubmit, handleClose } =
    useEditOrderForm(orderId, initialData, visible, onSuccess, onClose);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: "90%" }}>
            <EditOrderHeader onClose={handleClose} disabled={submitting} />

            <ScrollView
              className="px-5 py-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="bg-amber-50 rounded-xl p-4 mb-5 flex-row items-start gap-3">
                <WarningFillIcon width={18} height={18} color="#D97706" />
                <Typography variation="body-sm" className="flex-1 text-amber-900">
                  Please verify all details carefully. Once sent to NCM, it cannot be edited.
                </Typography>
              </View>

              <View className="gap-6">
                <EditOrderBuyerForm
                  name={fields.name}
                  email={fields.email}
                  phone={fields.phone}
                  onNameChange={setters.setName}
                  onEmailChange={setters.setEmail}
                  onPhoneChange={setters.setPhone}
                  errors={errors}
                />
                <EditOrderAddressForm
                  street={fields.street}
                  city={fields.city}
                  district={fields.district}
                  onStreetChange={setters.setStreet}
                  onCityChange={setters.setCity}
                  onDistrictChange={setters.setDistrict}
                  errors={errors}
                />
                <EditOrderNotes
                  notes={fields.notes}
                  onNotesChange={setters.setNotes}
                />
              </View>

              <View className="mt-6 mb-8 gap-3">
                <Button
                  label="Save Changes"
                  variant="primary"
                  onPress={handleSubmit}
                  isLoading={submitting}
                  disabled={submitting}
                  noShadow
                />
                <Button
                  label="Cancel"
                  variant="tertiary"
                  onPress={handleClose}
                  disabled={submitting}
                  noShadow
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
