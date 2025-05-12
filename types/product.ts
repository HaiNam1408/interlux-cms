import { Category } from "./category";

export enum ProductStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  OUTOFSTOCK = "OUTOFSTOCK"
}

export enum CommonStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export interface ProductAttribute {
  id: number;
  productId: number;
  name: string;
  slug: string;
  sort?: number;
  status: CommonStatus;
  createdAt: string;
  updatedAt: string;
  values?: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: number;
  attributeId: number;
  name: string;
  slug: string;
  value?: string;
}

export interface ProductVariation {
  id: number;
  productId: number;
  sku: string;
  price?: number;
  percentOff?: number;
  inventory: number;
  images?: Array<{type: string, fileName: string, filePath: string}>;
  isDefault: boolean;
  status: CommonStatus;
  createdAt: string;
  updatedAt: string;
  attributeValues?: ProductVariationValue[];
}

export interface ProductVariationValue {
  id: number;
  productVariationId: number;
  attributeValueId: number;
  name?: string;
  attributeValue?: ProductAttributeValue;
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
  model?: {type: string, fileName: string, filePath: string};
  images?: Array<{type: string, fileName: string, filePath: string}>;
  sort?: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  productAttributes?: ProductAttribute[];
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
  images?: Array<{type: string, fileName: string, filePath: string}>;
  model?: {type: string, fileName: string, filePath: string};
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
  images?: Array<{type: string, fileName: string, filePath: string}>;
  imagesToDelete?: Array<{fileName: string, url: string}>;
  model?: {type: string, fileName: string, filePath: string};
  removeModel?: boolean;
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

export interface CreateProductAttributeDto {
  name: string;
  slug?: string;
  sort?: number;
  status?: CommonStatus;
}

export interface UpdateProductAttributeDto {
  name?: string;
  slug?: string;
  sort?: number;
  status?: CommonStatus;
}

export interface CreateProductAttributeValueDto {
  name: string;
  slug?: string;
  value?: string;
  sort?: number;
  status?: CommonStatus;
}

export interface UpdateProductAttributeValueDto {
  name?: string;
  slug?: string;
  value?: string;
  sort?: number;
  status?: CommonStatus;
}

export interface CreateProductVariationDto {
  sku: string;
  price?: number;
  percentOff?: number;
  inventory?: number;
  images?: Array<{type: string, fileName: string, filePath: string}>;
  isDefault?: boolean;
  status?: CommonStatus;
  attributeValueIds: number[];
}

export interface UpdateProductVariationDto {
  sku?: string;
  price?: number;
  percentOff?: number;
  inventory?: number;
  images?: Array<{type: string, fileName: string, filePath: string}>;
  imagesToDelete?: Array<{fileName: string, url: string}>;
  isDefault?: boolean;
  status?: CommonStatus;
  attributeValueIds?: number[];
}