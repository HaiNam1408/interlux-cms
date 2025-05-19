import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Tag, GetAllTagsDto, CreateTagDto, UpdateTagDto } from '@/types/blog';

export const TagApiService = {
    async getTags(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedData<Tag> | null> {
        try {
            const queryParams: GetAllTagsDto = {
                page,
                limit,
                search
            };

            const response = await http.get<any>('/tag', {
                params: queryParams
            });

            if (response.data) {
                return {
                    data: response.data.data || [],
                    meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching tags:', error);
            return null;
        }
    },

    async getAllTags(): Promise<Tag[] | null> {
        try {
            const response = await http.get<any>('/tag/all');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching all tags:', error);
            return null;
        }
    },

    async getTagById(id: number): Promise<Tag | null> {
        try {
            const response = await http.get<any>(`/tag/${id}`);
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching tag ${id}:`, error);
            return null;
        }
    },

    async getTagBySlug(slug: string): Promise<Tag | null> {
        try {
            const response = await http.get<any>(`/tag/slug/${slug}`);
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching tag with slug ${slug}:`, error);
            return null;
        }
    },

    async createTag(tagData: CreateTagDto): Promise<Tag | null> {
        try {
            const response = await http.post<any>('/tag', tagData);
            return response.data || null;
        } catch (error) {
            console.error('Error creating tag:', error);
            throw error;
        }
    },

    async updateTag(id: number, tagData: UpdateTagDto): Promise<Tag | null> {
        try {
            const response = await http.patch<any>(`/tag/${id}`, tagData);
            return response.data || null;
        } catch (error) {
            console.error(`Error updating tag ${id}:`, error);
            throw error;
        }
    },

    async deleteTag(id: number): Promise<boolean> {
        try {
            await http.delete<any>(`/tag/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting tag ${id}:`, error);
            return false;
        }
    }
};
