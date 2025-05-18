import http from '@/lib/http';
import {
    ProductVariation,
    CreateProductVariationDto,
    UpdateProductVariationDto
} from '@/types/product';
import { PaginatedData } from '@/types/response';

export const ProductVariationApiService = {
    async getProductVariations(productId: number, page = 1, limit = 10): Promise<PaginatedData<ProductVariation> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/variation`, {
                params: { page, limit }
            });

            // Log the response structure to debug
            console.log('Product variations API response:', JSON.stringify(response.data, null, 2));

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
            console.warn('Could not parse product variations response in any expected format');
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
            console.error(`Error fetching product variations for product ${productId}:`, error);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        }
    },

    async getProductVariationById(productId: number, variationId: number): Promise<ProductVariation | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/variation/${variationId}`);

            // Log the response structure to debug
            console.log(`Product variation ${variationId} API response:`, JSON.stringify(response.data, null, 2));

            if (response.data && response.data.data) {
                const variation = response.data.data;

                // Log the variation data
                console.log('Parsed variation data:', variation);

                // Check if attributeValues exists and has the expected structure
                if (variation.attributeValues) {
                    console.log('Variation attributeValues:', variation.attributeValues);
                } else {
                    console.warn('attributeValues is missing in the variation data');
                }

                return variation;
            } else if (response.data) {
                // Some APIs might return the data directly without nesting
                const variation = response.data;
                console.log('Direct variation data:', variation);
                return variation;
            }

            console.warn(`No data found for product variation ${variationId}`);
            return null;
        } catch (error) {
            console.error(`Error fetching product variation ${variationId}:`, error);
            return null;
        }
    },

    async createProductVariation(productId: number, data: FormData | CreateProductVariationDto): Promise<ProductVariation | null> {
        try {
            // Use the same http instance for both FormData and JSON
            const response = await http.post<any>(`/product/${productId}/variation`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error creating product variation for product ${productId}:`, error);
            throw error;
        }
    },

    async updateProductVariation(productId: number, variationId: number, data: FormData | UpdateProductVariationDto): Promise<ProductVariation | null> {
        try {
            // Use the same http instance for both FormData and JSON
            const response = await http.patch<any>(`/product/${productId}/variation/${variationId}`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error updating product variation ${variationId}:`, error);
            throw error;
        }
    },

    async deleteProductVariation(productId: number, variationId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/variation/${variationId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            console.error(`Error deleting product variation ${variationId}:`, error);
            throw error;
        }
    }
};
