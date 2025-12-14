import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/lib/types/database";
import { supabase } from "@/lib/supabase";

interface ProductsState {
  // User's products (for my-products screen)
  userProducts: Product[];
  userProductsLoading: boolean;
  userProductsError: string | null;

  // Selected product (for product details screen)
  selectedProduct: Product | null;
  selectedProductLoading: boolean;
  selectedProductError: string | null;

  // Operation states
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

const initialState: ProductsState = {
  userProducts: [],
  userProductsLoading: false,
  userProductsError: null,

  selectedProduct: null,
  selectedProductLoading: false,
  selectedProductError: null,

  creating: false,
  updating: false,
  deleting: false,
};

// Fetch user's products (for my-products screen)
export const fetchUserProducts = createAsyncThunk(
  "products/fetchUserProducts",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data as Product[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data as Product;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    {
      productId,
      storeId,
      data,
    }: {
      productId: string;
      storeId: string;
      data: Partial<Product>;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data: updatedData, error } = await supabase
        .from("products")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .eq("store_id", storeId)
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return updatedData as Product;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

// Delete product (soft delete - sets is_active to false)
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (
    { productId, storeId }: { productId: string; storeId: string },
    { rejectWithValue }
  ) => {
    try {
      // Check if there are any active (non-completed) orders for this product
      // Only allow deletion if there are no orders OR all orders are in terminal states (completed, cancelled, refunded)
      const { data: activeOrders, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .eq("product_id", productId)
        .not("status", "in", '("completed","cancelled","refunded")')
        .limit(1);

      if (ordersError) {
        return rejectWithValue(ordersError.message);
      }

      if (activeOrders && activeOrders.length > 0) {
        return rejectWithValue(
          "Cannot delete this product. It has active orders that need to be completed or cancelled first."
        );
      }

      // Soft delete: set is_active to false instead of deleting
      const { error } = await supabase
        .from("products")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", productId)
        .eq("store_id", storeId);

      if (error) {
        return rejectWithValue(error.message);
      }

      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (
    productData: {
      title: string;
      description: string;
      price: number;
      category: string;
      availability_count: number;
      store_id: string;
      cover_image: string;
      other_images: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          ...productData,
          status: productData.availability_count > 0 ? "available" : "out_of_stock",
        })
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data as Product;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set selected product directly (useful when navigating from list)
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    // Clear selected product
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedProductError = null;
    },

    // Clear user products
    clearUserProducts: (state) => {
      state.userProducts = [];
      state.userProductsError = null;
    },

    // Clear all products state (on logout)
    clearAllProducts: (state) => {
      state.userProducts = [];
      state.userProductsLoading = false;
      state.userProductsError = null;
      state.selectedProduct = null;
      state.selectedProductLoading = false;
      state.selectedProductError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user products
    builder.addCase(fetchUserProducts.pending, (state) => {
      state.userProductsLoading = true;
      state.userProductsError = null;
    });
    builder.addCase(fetchUserProducts.fulfilled, (state, action) => {
      state.userProductsLoading = false;
      state.userProducts = action.payload;
    });
    builder.addCase(fetchUserProducts.rejected, (state, action) => {
      state.userProductsLoading = false;
      state.userProductsError = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.selectedProductLoading = true;
      state.selectedProductError = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.selectedProductLoading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.selectedProductLoading = false;
      state.selectedProductError = action.payload as string;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.updating = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.updating = false;
      const updatedProduct = action.payload;

      // Update in userProducts array
      const index = state.userProducts.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.userProducts[index] = updatedProduct;
      }

      // Update selectedProduct if it's the same product
      if (state.selectedProduct?.id === updatedProduct.id) {
        state.selectedProduct = updatedProduct;
      }
    });
    builder.addCase(updateProduct.rejected, (state) => {
      state.updating = false;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.deleting = false;
      const deletedId = action.payload;

      // Remove from userProducts array
      state.userProducts = state.userProducts.filter((p) => p.id !== deletedId);

      // Clear selectedProduct if it's the deleted product
      if (state.selectedProduct?.id === deletedId) {
        state.selectedProduct = null;
      }
    });
    builder.addCase(deleteProduct.rejected, (state) => {
      state.deleting = false;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.creating = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.creating = false;
      // Add to beginning of userProducts array
      state.userProducts.unshift(action.payload);
    });
    builder.addCase(createProduct.rejected, (state) => {
      state.creating = false;
    });
  },
});

export const {
  setSelectedProduct,
  clearSelectedProduct,
  clearUserProducts,
  clearAllProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
