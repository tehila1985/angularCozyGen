export interface AdminProduct {
  productId?: number;
  name: string;
  description: string;
  price: number;
  frontImageUrl: string;
  backImageUrl: string;
  categoryId: number;
  styleId: number;
}

export interface AdminCategory {
  categoryId?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface AdminStyle {
  styleId?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}
