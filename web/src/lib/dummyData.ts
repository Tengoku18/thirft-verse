export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  photo_url: string;
  status: 'available' | 'sold';
  creator_id: string;
}

export interface User {
  id: string;
  name: string;
  instagram_handle: string;
  image_url: string;
  currency: string;
}

// Dummy users
export const dummyUsers: Record<string, User> = {
  vintagejoe: {
    id: '1',
    name: 'Vintage Joe',
    instagram_handle: 'vintagejoe',
    image_url:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    currency: 'USD',
  },
  retrostyle: {
    id: '2',
    name: 'Retro Style Boutique',
    instagram_handle: 'retrostyle',
    image_url:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    currency: 'USD',
  },
  thriftqueen: {
    id: '3',
    name: 'Thrift Queen',
    instagram_handle: 'thriftqueen',
    image_url:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    currency: 'USD',
  },
};

// Dummy products
export const dummyProducts: Record<string, Product[]> = {
  '1': [
    {
      id: 'p1',
      title: 'Vintage Leather Jacket',
      description:
        'Classic brown leather jacket from the 80s. Excellent condition.',
      price: 85,
      photo_url:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
    {
      id: 'p2',
      title: 'Retro Denim Jeans',
      description: 'High-waisted mom jeans with perfect fade.',
      price: 45,
      photo_url:
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
    {
      id: 'p3',
      title: 'Vintage Band T-Shirt',
      description: 'Original 90s Rolling Stones tour tee.',
      price: 35,
      photo_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
    {
      id: 'p4',
      title: 'Classic Sneakers',
      description: 'Retro white sneakers, barely worn.',
      price: 60,
      photo_url:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
    {
      id: 'p5',
      title: 'Vintage Sunglasses',
      description: 'Classic aviator style from the 70s.',
      price: 25,
      photo_url:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
    {
      id: 'p6',
      title: 'Wool Cardigan',
      description: 'Cozy vintage cardigan in great condition.',
      price: 40,
      photo_url:
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '1',
    },
  ],
  '2': [
    {
      id: 'p7',
      title: 'Floral Summer Dress',
      description: 'Beautiful vintage floral dress perfect for summer.',
      price: 55,
      photo_url:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '2',
    },
    {
      id: 'p8',
      title: 'Silk Scarf',
      description: 'Elegant vintage silk scarf with unique pattern.',
      price: 30,
      photo_url:
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '2',
    },
    {
      id: 'p9',
      title: 'Vintage Handbag',
      description: 'Classic leather handbag from the 60s.',
      price: 75,
      photo_url:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '2',
    },
  ],
  '3': [
    {
      id: 'p10',
      title: 'Oversized Blazer',
      description: 'Trendy oversized vintage blazer.',
      price: 50,
      photo_url:
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '3',
    },
    {
      id: 'p11',
      title: 'Platform Boots',
      description: 'Vintage platform boots from the 90s.',
      price: 65,
      photo_url:
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop',
      status: 'available',
      creator_id: '3',
    },
  ],
};

// Helper functions to simulate API calls
export async function getUserIdByInstagramHandle(
  instagramHandle: string
): Promise<string | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const user = Object.values(dummyUsers).find(
    (u) => u.instagram_handle === instagramHandle
  );
  return user?.id || null;
}

export async function getUserById(id: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const user = Object.values(dummyUsers).find((u) => u.id === id);
  return user || null;
}

export async function getProductsByCreatorId(
  creatorId: string
): Promise<{ data: Product[]; count: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const products = dummyProducts[creatorId] || [];
  return {
    data: products,
    count: products.length,
  };
}
