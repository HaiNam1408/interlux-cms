import http from '@/lib/http';
import { PaginatedData, PaginationResponse } from '@/types/response';
import { Category } from '@/types/category';

export const CategoryService = {
    async getCategories(page: number = 1, limit: number = 100): Promise<PaginatedData<Category> | null> {
        try {
            const response = await http.get<PaginationResponse<Category>>('/category', { params: { page, limit } });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    },

    async getCategoryById(id: number) {
        try {
            const response = await http.get<Category>(`/category/${id}`);
            return response;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            return null;
        }
    },

    async getCategoryBySlug(slug: string) {
        try {
            const response = await http.get<Category>(`/category/slug/${slug}`);
            return response;
        } catch (error) {
            console.error(`Error fetching category with slug ${slug}:`, error);
            return null;
        }
    },

    async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'slug' | 'children'>) {
        try {
            const response = await http.post<Category>('/category', category);
            return response;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    async updateCategory(id: number, category: any) {
        try {
            delete category.children;
            const response = await http.put<Category>(`/category/${id}`, category);
            return response;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    },

    async deleteCategory(id: number) {
        try {
            await http.delete(`/category/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    },

    async getAllCategories() {
        try {
            const response = await http.get<PaginationResponse<Category>>('/category', { params: { limit: 100 } });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            return [];
        }
    },

    async getParentCategories() {
        try {
            const allCategories = await this.getAllCategories();
            return allCategories.filter((c: Category) => c.parentId === null) ?? [];
        } catch (error) {
            console.error('Error fetching parent categories:', error);
            return [];
        }
    },

    async getChildCategories(parentId: number) {
        try {
            const allCategories = await this.getAllCategories();
            return allCategories.filter((c) => c.parentId === parentId);
        } catch (error) {
            console.error(`Error fetching child categories for parent ${parentId}:`, error);
            return [];
        }
    }
};


