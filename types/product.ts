import { Category } from "./category";

export enum ProductStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  OUTOFSTOCK = "OUTOFSTOCK"
}

export interface ProductVariation {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  productId: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  percentOff?: number;
  sold: number;
  attributes?: Record<string, any>;
  categoryId: number;
  category?: Category;
  images?: Array<{type: string, fileName: string, filePath: string}> | string[] | Record<string, any>;
  sort?: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  variations?: ProductVariation[];
}

export interface CreateProductDto {
  title: string;
  slug?: string;
  description?: string;
  price: number;
  percentOff?: number;
  attributes?: Record<string, any>;
  categoryId: number;
  images?: string[] | Record<string, any>;
  sort?: number;
  status?: ProductStatus;
}

export interface UpdateProductDto {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  percentOff?: number;
  attributes?: Record<string, any>;
  categoryId?: number;
  images?: string[] | Record<string, any>;
  sort?: number;
  status?: ProductStatus;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}