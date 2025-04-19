export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type PaginatedData<T> = {
    data: T[];
    meta: PaginationMeta;
}

export type PaginationResponse<T> = {
    message: string;
    statusCode: number;
    data: PaginatedData<T>;
};

export type SingleResponse<T> = {
    message: string;
    statusCode: number;
    data: T;
};