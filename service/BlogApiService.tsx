import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Post, GetAllPostsDto, CreatePostDto, UpdatePostDto, PostStatus } from '@/types/blog';

export const BlogApiService = {
    async getPosts(page: number = 1, limit: number = 10, params?: Omit<GetAllPostsDto, 'page' | 'limit'>): Promise<PaginatedData<Post> | null> {
        try {
            const queryParams: GetAllPostsDto = {
                page,
                limit,
                ...params
            };

            const response = await http.get<any>('/blog', {
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
            return null;
        }
    },

    async getPostById(id: number): Promise<Post | null> {
        try {
            const response = await http.get<any>(`/blog/${id}`);
            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const response = await http.get<any>(`/blog/slug/${slug}`);
            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    async createPost(postData: CreatePostDto): Promise<Post | null> {
        try {
            const formData = new FormData();
            
            formData.append('title', postData.title);
            formData.append('content', postData.content);
            
            if (postData.description) {
                formData.append('description', postData.description);
            }
            
            if (postData.metaTitle) {
                formData.append('metaTitle', postData.metaTitle);
            }
            
            if (postData.metaDescription) {
                formData.append('metaDescription', postData.metaDescription);
            }
            
            if (postData.status) {
                formData.append('status', postData.status);
            }
            
            if (postData.publishedAt) {
                formData.append('publishedAt', postData.publishedAt);
            }
            
            if (postData.tagIds && postData.tagIds.length > 0) {
                postData.tagIds.forEach(tagId => {
                    formData.append('tagIds', tagId.toString());
                });
            }
            
            if (postData.thumbnail) {
                formData.append('thumbnail', postData.thumbnail);
            }
            
            const response = await http.post<any>('/blog', formData);
            return response.data || null;
        } catch (error) {
            throw error;
        }
    },

    async updatePost(id: number, postData: UpdatePostDto): Promise<Post | null> {
        try {
            const formData = new FormData();
            
            if (postData.title) {
                formData.append('title', postData.title);
            }
            
            if (postData.content) {
                formData.append('content', postData.content);
            }
            
            if (postData.description !== undefined) {
                formData.append('description', postData.description || '');
            }
            
            if (postData.metaTitle !== undefined) {
                formData.append('metaTitle', postData.metaTitle || '');
            }
            
            if (postData.metaDescription !== undefined) {
                formData.append('metaDescription', postData.metaDescription || '');
            }
            
            if (postData.status) {
                formData.append('status', postData.status);
            }
            
            if (postData.publishedAt !== undefined) {
                formData.append('publishedAt', postData.publishedAt || '');
            }
            
            if (postData.tagIds) {
                postData.tagIds.forEach(tagId => {
                    formData.append('tagIds', tagId.toString());
                });
            }
            
            if (postData.thumbnail) {
                formData.append('thumbnail', postData.thumbnail);
            }
            
            if (postData.removeThumbnail) {
                formData.append('removeThumbnail', 'true');
            }
            
            const response = await http.patch<any>(`/blog/${id}`, formData);
            return response.data || null;
        } catch (error) {
            throw error;
        }
    },

    async deletePost(id: number): Promise<boolean> {
        try {
            await http.delete<any>(`/blog/${id}`);
            return true;
        } catch (error) {
            return false;
        }
    }
};
