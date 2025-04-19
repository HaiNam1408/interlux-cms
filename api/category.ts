import http from "@/lib/http";
import { Category, CategoryQueryParams, CreateCategoryDto, UpdateCategoryDto } from "@/types/category";
import { SingleResponse, PaginationResponse } from "@/types/response";

const categoryApiRequest = {
    /**
     * Get all categories with pagination
     * @param params Query parameters for pagination and filtering
     * @returns Paginated list of categories
     */
    getAll: (params?: CategoryQueryParams) =>
        http.get<PaginationResponse<Category[]>>(
            "/api/v1/category",
            { params }
        ),

    /**
     * Get a category by ID
     * @param id Category ID
     * @returns Category details
     */
    getById: (id: number) =>
        http.get<SingleResponse<Category>>(
            `/api/v1/category/${id}`
        ),

    /**
     * Get a category by slug
     * @param slug Category slug
     * @returns Category details
     */
    getBySlug: (slug: string) =>
        http.get<SingleResponse<Category>>(
            `/api/v1/category/slug/${slug}`
        ),

    /**
     * Create a new category
     * @param data Category data
     * @returns The created category
     */
    create: (data: CreateCategoryDto) =>
        http.post<SingleResponse<Category>>(
            "/api/v1/category",
            data
        ),

    /**
     * Update an existing category
     * @param id Category ID
     * @param data Updated category data
     * @returns The updated category
     */
    update: (id: number, data: UpdateCategoryDto) =>
        http.put<SingleResponse<Category>>(
            `/api/v1/category/${id}`,
            data
        ),

    /**
     * Delete a category
     * @param id Category ID
     * @returns Success response
     */
    delete: (id: number) =>
        http.delete<SingleResponse<{ success: boolean }>>(
            `/api/v1/category/${id}`
        ),
};

export default categoryApiRequest;