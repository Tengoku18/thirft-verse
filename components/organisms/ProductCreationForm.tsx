import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { ProductForm } from "@/components/organisms/ProductForm";
import React from "react";

export const ProductCreationForm: React.FC = () => {
  return (
    <TabScreenLayout title="Add Product">
      <ProductForm mode="create" />
    </TabScreenLayout>
  );
};
