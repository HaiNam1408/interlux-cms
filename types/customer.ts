export interface Customer {
    id: number;
    username: string;
    email: string;
    phone: string;
    address?: string;
    avatar?: {
        type: string;
        fileName: string;
        filePath: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerDto {
    username: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    avatar?: File;
}

export interface UpdateCustomerDto {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    address?: string;
    avatar?: File | string;
}

export interface CustomerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CustomerOrder {
    id: number;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
}
