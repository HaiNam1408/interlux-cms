import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Customer, CustomerQueryParams, CustomerOrder, CreateCustomerDto, UpdateCustomerDto } from '@/types/customer';

export const CustomerApiService = {
    async getCustomers(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedData<Customer> | null> {
        try {
            const queryParams: CustomerQueryParams = {
                page,
                limit,
                search
            };

            const response = await http.get<any>('/customer', {
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

    async getCustomerById(id: number): Promise<Customer | null> {
        try {
            const response = await http.get<any>(`/customer/${id}`);
            return response.data || null;
        } catch (error) {
            return null;
        }
    },

    async createCustomer(customerData: CreateCustomerDto): Promise<Customer | null> {
        try {
            const formData = new FormData();
            
            formData.append('username', customerData.username);
            formData.append('email', customerData.email);
            formData.append('phone', customerData.phone);
            formData.append('password', customerData.password);
            
            if (customerData.address) {
                formData.append('address', customerData.address);
            }
            
            if (customerData.avatar) {
                formData.append('avatar', customerData.avatar);
            }
            
            const response = await http.post<any>('/customer', formData);
            return response.data || null;
        } catch (error) {
            throw error;
        }
    },

    async updateCustomer(id: number, customerData: UpdateCustomerDto): Promise<Customer | null> {
        try {
            const formData = new FormData();
            
            if (customerData.username) {
                formData.append('username', customerData.username);
            }
            
            if (customerData.email) {
                formData.append('email', customerData.email);
            }
            
            if (customerData.phone) {
                formData.append('phone', customerData.phone);
            }
            
            if (customerData.password) {
                formData.append('password', customerData.password);
            }
            
            if (customerData.address !== undefined) {
                formData.append('address', customerData.address);
            }
            
            if (customerData.avatar instanceof File) {
                formData.append('avatar', customerData.avatar);
            } else if (customerData.avatar === '') {
                formData.append('avatar', '');
            }
            
            const response = await http.put<any>(`/customer/${id}`, formData);
            return response.data || null;
        } catch (error) {
            throw error;
        }
    },

    async deleteCustomer(id: number): Promise<boolean> {
        try {
            await http.delete(`/customer/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    async getCustomerOrders(id: number, page: number = 1, limit: number = 10): Promise<PaginatedData<CustomerOrder> | null> {
        try {
            const response = await http.get<any>(`/customer/${id}/orders`, {
                params: { page, limit }
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
    }
};
