import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Order, OrderStatus, OrderStatistics, GetAllOrdersDto, UpdateOrderStatusDto } from '@/types/order';

export const OrderApiService = {
    async getOrders(
        page: number = 1, 
        limit: number = 10, 
        status?: OrderStatus, 
        search?: string, 
        userId?: number
    ): Promise<PaginatedData<Order> | null> {
        try {
            const queryParams: GetAllOrdersDto = {
                page,
                limit,
                status,
                search,
                userId
            };

            const response = await http.get<any>('/order', {
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
            console.error('Error fetching orders:', error);
            return null;
        }
    },

    async getOrderById(id: number): Promise<Order | null> {
        try {
            const response = await http.get<any>(`/order/${id}`);
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            return null;
        }
    },

    async updateOrderStatus(id: number, statusData: UpdateOrderStatusDto): Promise<Order | null> {
        try {
            const response = await http.put<any>(`/order/${id}/status`, statusData);
            return response.data || null;
        } catch (error) {
            console.error(`Error updating order status for order ${id}:`, error);
            throw error;
        }
    },

    async getOrderStatistics(): Promise<OrderStatistics | null> {
        try {
            const response = await http.get<any>('/order/statistics/dashboard');
            return response.data || null;
        } catch (error) {
            console.error('Error fetching order statistics:', error);
            return null;
        }
    },

    // Helper methods for specific order types
    async getReturnedOrders(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedData<Order> | null> {
        return this.getOrders(page, limit, OrderStatus.RETURNED, search);
    },

    async getRefundedOrders(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedData<Order> | null> {
        return this.getOrders(page, limit, OrderStatus.REFUNDED, search);
    }
};
