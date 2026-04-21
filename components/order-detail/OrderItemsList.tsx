import { OrderDetailItem } from "@/lib/types/order";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { OrderItemCard } from "./OrderItemCard";

interface OrderItemsListProps {
  items: OrderDetailItem[];
  product: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    category: string;
  };
  quantity: number;
}

export function OrderItemsList({ items, product, quantity }: OrderItemsListProps) {
  const router = useRouter();

  return (
    <View className="bg-white rounded-[20px] overflow-hidden shadow-sm">
      {items.length > 1 ? (
        items.map((item, idx) => (
          <OrderItemCard
            key={item.id + idx}
            title={item.title}
            image={item.image}
            category=""
            price={item.price}
            quantity={item.quantity}
            isLast={idx === items.length - 1}
            onPress={() => router.push(`/product/${item.id}` as any)}
          />
        ))
      ) : (
        <OrderItemCard
          title={product.title}
          image={product.image}
          category={product.category}
          price={product.price}
          quantity={quantity}
          isLast
          onPress={product.id ? () => router.push(`/product/${product.id}` as any) : undefined}
        />
      )}
    </View>
  );
}
