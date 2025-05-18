import http from '@/lib/http';
import {
    ProductAttribute,
    ProductAttributeValue,
    CreateProductAttributeDto,
    UpdateProductAttributeDto,
    CreateProductAttributeValueDto,
    UpdateProductAttributeValueDto
} from '@/types/product';
import { PaginatedData } from '@/types/response';

export const ProductAttributeApiService = {
    // Product Attribute APIs
    async getProductAttributes(productId: number, page = 1, limit = 10): Promise<PaginatedData<ProductAttribute> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute`, {
                params: { page, limit }
            });

            console.log(`Product attributes API response for product ${productId}:`, JSON.stringify(response.data, null, 2));

            if (response.data) {
                // Check if the response has a nested data.data structure (common in some APIs)
                if (response.data.data && response.data.data.data) {
                    return {
                        data: response.data.data.data || [],
                        meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };
                }
                // Check if response.data.data is an array (common structure)
                else if (Array.isArray(response.data.data)) {
                    return {
                        data: response.data.data || [],
                        meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };
                }
                // If response.data itself is an array (some APIs return direct array)
                else if (Array.isArray(response.data)) {
                    return {
                        data: response.data || [],
                        meta: { total: response.data.length, page: 1, limit: 10, totalPages: 1 }
                    };
                }
            }

            // If we couldn't parse the response in any expected format, return empty data
            console.warn(`Could not parse product attributes response for product ${productId} in any expected format`);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
            console.error(`Error fetching product attributes for product ${productId}:`, error);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        }
    },

    async getProductAttributeById(productId: number, attributeId: number): Promise<ProductAttribute | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute/${attributeId}`);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching product attribute ${attributeId}:`, error);
            return null;
        }
    },

    async createProductAttribute(productId: number, data: CreateProductAttributeDto): Promise<ProductAttribute | null> {
        try {
            const response = await http.post<any>(`/product/${productId}/attribute`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error creating product attribute for product ${productId}:`, error);
            throw error;
        }
    },

    async updateProductAttribute(productId: number, attributeId: number, data: UpdateProductAttributeDto): Promise<ProductAttribute | null> {
        try {
            const response = await http.patch<any>(`/product/${productId}/attribute/${attributeId}`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error updating product attribute ${attributeId}:`, error);
            throw error;
        }
    },

    async deleteProductAttribute(productId: number, attributeId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/attribute/${attributeId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            console.error(`Error deleting product attribute ${attributeId}:`, error);
            throw error;
        }
    },

    // Product Attribute Value APIs
    async getAttributeValues(productId: number, attributeId: number, page = 1, limit = 10): Promise<PaginatedData<ProductAttributeValue> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute/${attributeId}/value`, {
                params: { page, limit }
            });

            console.log(`Attribute values API response for attribute ${attributeId}:`, JSON.stringify(response.data, null, 2));

            if (response.data) {
                // Check if the response has a nested data.data structure (common in some APIs)
                if (response.data.data && response.data.data.data) {
                    return {
                        data: response.data.data.data || [],
                        meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };
                }
                // Check if response.data.data is an array (common structure)
                else if (Array.isArray(response.data.data)) {
                    return {
                        data: response.data.data || [],
                        meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };
                }
                // If response.data itself is an array (some APIs return direct array)
                else if (Array.isArray(response.data)) {
                    return {
                        data: response.data || [],
                        meta: { total: response.data.length, page: 1, limit: 10, totalPages: 1 }
                    };
                }
            }

            // If we couldn't parse the response in any expected format, return empty data
            console.warn(`Could not parse attribute values response for attribute ${attributeId} in any expected format`);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
            console.error(`Error fetching attribute values for attribute ${attributeId}:`, error);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        }
    },

    async getAttributeValueById(productId: number, attributeId: number, valueId: number): Promise<ProductAttributeValue | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute/${attributeId}/value/${valueId}`);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching attribute value ${valueId}:`, error);
            return null;
        }
    },

    async createAttributeValue(productId: number, attributeId: number, data: CreateProductAttributeValueDto): Promise<ProductAttributeValue | null> {
        try {
            const response = await http.post<any>(`/product/${productId}/attribute/${attributeId}/value`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error creating attribute value for attribute ${attributeId}:`, error);
            throw error;
        }
    },

    async updateAttributeValue(productId: number, attributeId: number, valueId: number, data: UpdateProductAttributeValueDto): Promise<ProductAttributeValue | null> {
        try {
            const response = await http.patch<any>(`/product/${productId}/attribute/${attributeId}/value/${valueId}`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error updating attribute value ${valueId}:`, error);
            throw error;
        }
    },

    async deleteAttributeValue(productId: number, attributeId: number, valueId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/attribute/${attributeId}/value/${valueId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            console.error(`Error deleting attribute value ${valueId}:`, error);
            throw error;
        }
    }
};
