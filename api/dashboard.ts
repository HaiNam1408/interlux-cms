import http from "@/lib/http";
import { SingleResponse } from "@/types/response";
import { 
    DashboardStatsDto, 
    SalesStatisticsDto, 
    ProductStatisticsDto, 
    CustomerStatisticsDto, 
    OrderStatisticsDto 
} from "@/types/dashboard";

export interface AllDashboardStatistics {
    sales: SalesStatisticsDto;
    products: ProductStatisticsDto;
    customers: CustomerStatisticsDto;
    orders: OrderStatisticsDto;
}

const dashboardApiRequest = {
    /**
     * Get all dashboard statistics
     * @param params Query parameters for date filtering
     * @returns All dashboard statistics
     */
    getAllStatistics: (params?: DashboardStatsDto) =>
        http.get<SingleResponse<AllDashboardStatistics>>(
            "/dashboard",
            { params }
        ),

    /**
     * Get sales statistics
     * @param params Query parameters for date filtering
     * @returns Sales statistics
     */
    getSalesStatistics: (params?: DashboardStatsDto) =>
        http.get<SingleResponse<SalesStatisticsDto>>(
            "/dashboard/sales",
            { params }
        ),

    /**
     * Get product statistics
     * @returns Product statistics
     */
    getProductStatistics: () =>
        http.get<SingleResponse<ProductStatisticsDto>>(
            "/dashboard/products"
        ),

    /**
     * Get customer statistics
     * @param params Query parameters for date filtering
     * @returns Customer statistics
     */
    getCustomerStatistics: (params?: DashboardStatsDto) =>
        http.get<SingleResponse<CustomerStatisticsDto>>(
            "/dashboard/customers",
            { params }
        ),

    /**
     * Get order statistics
     * @returns Order statistics
     */
    getOrderStatistics: () =>
        http.get<SingleResponse<OrderStatisticsDto>>(
            "/dashboard/orders"
        ),
};

export default dashboardApiRequest;
