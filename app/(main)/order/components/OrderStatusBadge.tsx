import React from 'react';
import { Tag } from 'primereact/tag';
import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const getSeverity = (status: OrderStatus): "warning" | "info" | "success" | "danger" | null | undefined => {
        switch (status) {
            case OrderStatus.PENDING || OrderStatus.RETURNED:
                return 'warning';
            case OrderStatus.DELIVERED:
                return 'success';
            case OrderStatus.CANCELLED:
                return 'danger';
            default:
                return 'info';
        }
    };

    return <Tag value={status} severity={getSeverity(status)} className="text-sm font-medium" />;
};

export default OrderStatusBadge;
