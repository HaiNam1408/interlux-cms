
export enum PostStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content: string;
    view: number;
    thumbnail?: {
        type: string;
        fileName: string;
        filePath: string;
    };
    metaTitle?: string;
    metaDescription?: string;
    status: PostStatus;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    tags: {
        tag: Tag
    }[];
}

export interface CreatePostDto {
    title: string;
    content: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: PostStatus;
    publishedAt?: string;
    tagIds?: number[];
    thumbnail?: File;
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: PostStatus;
    publishedAt?: string;
    tagIds?: number[];
    thumbnail?: File;
    removeThumbnail?: boolean;
}

export interface GetAllPostsDto {
    page?: number;
    limit?: number;
    status?: PostStatus;
    search?: string;
    tagId?: number;
}

export interface CreateTagDto {
    name: string;
}

export interface UpdateTagDto {
    name: string;
}

export interface GetAllTagsDto {
    page?: number;
    limit?: number;
    search?: string;
}
