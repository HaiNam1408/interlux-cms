export interface Category {
    id: number;
    name: string;
    slug: string;
    sort?: number;
    parentId?: number | null;
    parent?: Category;
    children?: Category[];
    image?: {
        type: string;
        fileName: string;
        filePath: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    slug?: string;
    sort?: number;
    parentId?: number | null;
    image?: File;
}

export interface UpdateCategoryDto {
    name?: string;
    slug?: string;
    sort?: number;
    parentId?: number | null;
    image?: File | string;
    imageToDelete?: boolean;
}

export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: number;
}