import http from '@/lib/http';
import { ProductAttribute, ProductAttributeValue, CreateProductAttributeDto, UpdateProductAttributeDto, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from '@/types/product';
import { PaginatedData } from '@/types/response';

export const ProductAttributeApiService = {
    async getProductAttributes(productId: number, page = 1, limit = 10): Promise<PaginatedData<ProductAttribute> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute`, {
                params: { page, limit }
            });
            if (response.data) {
                return {
                    data: response.data || [],
                    meta: { total: response.data.length, page: 1, limit: 10, totalPages: 1 }
                };
            }

            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
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
            throw error;
        }
    },

    async deleteProductAttribute(productId: number, attributeId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/attribute/${attributeId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            throw error;
        }
    },

    async getAttributeValues(productId: number, attributeId: number, page = 1, limit = 10): Promise<PaginatedData<ProductAttributeValue> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/attribute/${attributeId}/value`, {
                params: { page, limit }
            });

            if (response.data) {
                return {
                    data: response.data || [],
                    meta: { total: response.data.length, page: 1, limit: 10, totalPages: 1 }
                };
            }

            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
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
            throw error;
        }
    },

    async deleteAttributeValue(productId: number, attributeId: number, valueId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/attribute/${attributeId}/value/${valueId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            throw error;
        }
    }
};
