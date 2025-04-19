export interface Category {
    id: number;
    name: string;
    slug: string;
    sort?: number;
    parentId?: number | null;
    parent?: Category;
    children?: Category[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    slug?: string;
    sort?: number;
    parentId?: number | null;
}

export interface UpdateCategoryDto {
    name?: string;
    slug?: string;
    sort?: number;
    parentId?: number | null;
}

export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: number;
}