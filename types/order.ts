import { Product } from "./product";

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    REFUNDED = 'REFUNDED'
}

export interface OrderItem {
    id: number;
    productId: number;
    product: Product;
    quantity: number;
    price: number;
    total: number;
    variationOptions?: string;
}

export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    user: {
        id: number;
        username: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    status: OrderStatus;
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    shippingAddress: string;
    paymentMethod: string;
    paymentStatus: 'PAID' | 'UNPAID';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
    id: number;
    orderId: number;
    status: OrderStatus;
    note?: string;
    createdAt: string;
}

export interface OrderStatistics {
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    refundedOrders: number;
    completedOrders: number;
    recentOrders: Order[];
}

export interface GetAllOrdersDto {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
    userId?: number;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
    note?: string;
}
