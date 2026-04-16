import { updateOrderDetails } from "@/lib/database-helpers";
import {
  cleanNepaliPhone,
  isValidNepaliPhone,
} from "@/lib/validations/create-order";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface OrderInitialData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    country: string;
  } | null;
  buyerNotes?: string;
}

export function useEditOrderForm(
  orderId: string,
  initialData: OrderInitialData,
  visible: boolean,
  onSuccess: () => void,
  onClose: () => void,
) {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(initialData.buyerName);
  const [email, setEmail] = useState(initialData.buyerEmail);
  const [phone, setPhone] = useState(initialData.buyerPhone);
  const [street, setStreet] = useState(initialData.shippingAddress?.street || "");
  const [city, setCity] = useState(initialData.shippingAddress?.city || "");
  const [district, setDistrict] = useState(initialData.shippingAddress?.district || "");
  const [notes, setNotes] = useState(initialData.buyerNotes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setName(initialData.buyerName);
    setEmail(initialData.buyerEmail);
    setPhone(initialData.buyerPhone);
    setStreet(initialData.shippingAddress?.street || "");
    setCity(initialData.shippingAddress?.city || "");
    setDistrict(initialData.shippingAddress?.district || "");
    setNotes(initialData.buyerNotes || "");
    setErrors({});
  }, [visible, initialData]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Buyer name is required";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Please enter a valid email address";
    const cleanedPhone = cleanNepaliPhone(phone);
    if (!cleanedPhone) e.phone = "Phone number is required";
    else if (!isValidNepaliPhone(cleanedPhone))
      e.phone = "Enter valid 10-digit Nepali number (e.g., 98XXXXXXXX)";
    if (!street.trim()) e.street = "Street address is required";
    else if (street.trim().length < 5) e.street = "Street address must be at least 5 characters";
    if (!city.trim()) e.city = "City is required";
    if (!district) e.district = "Please select a district";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const cleanedPhone = cleanNepaliPhone(phone);
      const result = await updateOrderDetails({
        orderId,
        buyerName: name.trim(),
        buyerEmail: email.trim().toLowerCase(),
        buyerPhone: cleanedPhone,
        shippingAddress: { street: street.trim(), city: city.trim(), district, country: "Nepal" },
        buyerNotes: notes.trim() || undefined,
      });
      if (result.success) { onSuccess(); onClose(); }
      else Alert.alert("Error", result.error || "Failed to update order");
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    fields: { name, email, phone, street, city, district, notes },
    setters: { setName, setEmail, setPhone, setStreet, setCity, setDistrict, setNotes },
    errors,
    submitting,
    handleSubmit,
    handleClose: () => { if (!submitting) onClose(); },
  };
}
