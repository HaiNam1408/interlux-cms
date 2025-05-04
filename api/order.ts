import http from "@/lib/http";
import { Order, OrderStatistics, GetAllOrdersDto, UpdateOrderStatusDto } from "@/types/order";
import { SingleResponse, PaginationResponse } from "@/types/response";

const orderApiRequest = {
    /**
     * Get all orders with pagination and filtering
     * @param params Query parameters for pagination and filtering
     * @returns Paginated list of orders
     */
    getAll: (params?: GetAllOrdersDto) =>
        http.get<PaginationResponse<Order[]>>(
            "/order",
            { params }
        ),

    /**
     * Get order by ID
     * @param id Order ID
     * @returns Order details
     */
    getById: (id: number) =>
        http.get<SingleResponse<Order>>(
            `/order/${id}`
        ),

    /**
     * Update order status
     * @param id Order ID
     * @param data Updated status data
     * @returns The updated order
     */
    updateStatus: (id: number, data: UpdateOrderStatusDto) =>
        http.put<SingleResponse<Order>>(
            `/order/${id}/status`,
            data
        ),

    /**
     * Get order statistics for dashboard
     * @returns Order statistics
     */
    getStatistics: () =>
        http.get<SingleResponse<OrderStatistics>>(
            `/order/statistics/dashboard`
        ),
};

export default orderApiRequest;
