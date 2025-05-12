export interface DashboardStatsDto {
    startDate?: string;
    endDate?: string;
}

export interface SalesStatisticsDto {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueByStatus: Record<string, number>;
}

export interface ProductStatisticsDto {
    totalProducts: number;
    totalVariations: number;
    productsByStatus: Record<string, number>;
    topSellingProducts: Array<{
        id: number;
        title: string;
        sold: number;
        revenue: number;
    }>;
}

export interface CustomerStatisticsDto {
    totalCustomers: number;
    newCustomers: number;
    topCustomers: Array<{
        id: number;
        username: string;
        email: string;
        totalSpent: number;
        ordersCount: number;
    }>;
}

export interface OrderStatisticsDto {
    ordersByStatus: Record<string, number>;
    recentOrders: Array<{
        id: number;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
        username: string;
    }>;
}
