import http from '@/lib/http';
import { PaginatedData, PaginationResponse } from '@/types/response';
import { Category } from '@/types/category';

export const CategoryService = {
    async getCategories(page: number = 1, limit: number = 100): Promise<PaginatedData<Category> | null> {
        try {
            const response = await http.get<PaginationResponse<Category>>('/category', { params: { page, limit } });
            return response.data;
        } catch (error) {
            return null;
        }
    },

    async getCategoryById(id: number) {
        try {
            const response = await http.get<Category>(`/category/${id}`);
            return response;
        } catch (error) {
            return null;
        }
    },

    async getCategoryBySlug(slug: string) {
        try {
            const response = await http.get<Category>(`/category/slug/${slug}`);
            return response;
        } catch (error) {
            return null;
        }
    },

    async createCategory(category: {
        name: string;
        slug?: string;
        sort?: number;
        parentId?: number | null;
        image?: File;
    }) {
        try {
            const formData = new FormData();
            formData.append('name', category.name);

            if (category.slug) {
                formData.append('slug', category.slug);
            }

            if (category.sort !== undefined) {
                formData.append('sort', category.sort.toString());
            }

            if (category.parentId !== undefined && category.parentId !== null) {
                formData.append('parentId', category.parentId.toString());
            }

            if (category.image) {
                formData.append('image', category.image);
            }

            const response = await http.post<Category>('/category', formData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateCategory(id: number, category: any) {
        try {
            delete category.children;

            const formData = new FormData();

            if (category.name) {
                formData.append('name', category.name);
            }

            if (category.slug) {
                formData.append('slug', category.slug);
            }

            if (category.sort !== undefined) {
                formData.append('sort', category.sort.toString());
            }

            if (category.parentId !== undefined) {
                if (category.parentId === null) {
                    formData.append('parentId', '');
                } else {
                    formData.append('parentId', category.parentId.toString());
                }
            }

            // Handle image upload
            if (category.image instanceof File) {
                formData.append('image', category.image);
            } else if (category.image === '') {
                formData.append('image', '');
            }

            const response = await http.put<Category>(`/category/${id}`, formData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteCategory(id: number) {
        try {
            await http.delete(`/category/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    async getAllCategories() {
        try {
            const response = await http.get<PaginationResponse<Category>>('/category', { params: { limit: 100 } });
            return response.data.data;
        } catch (error) {
            return [];
        }
    },

    async getParentCategories() {
        try {
            const allCategories = await this.getAllCategories();
            return allCategories.filter((c: Category) => c.parentId === null) ?? [];
        } catch (error) {
            return [];
        }
    },

    async getChildCategories(parentId: number) {
        try {
            const allCategories = await this.getAllCategories();
            return allCategories.filter((c) => c.parentId === parentId);
        } catch (error) {
            return [];
        }
    }
};


