import React from 'react';
import { Tag } from 'primereact/tag';
import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const getSeverity = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'warning';
            case OrderStatus.PROCESSING:
                return 'info';
            case OrderStatus.SHIPPED:
                return 'primary';
            case OrderStatus.DELIVERED:
                return 'success';
            case OrderStatus.CANCELLED:
                return 'danger';
            case OrderStatus.RETURNED:
                return 'secondary';
            case OrderStatus.REFUNDED:
                return 'help';
            default:
                return 'info';
        }
    };

    return (
        <Tag 
            value={status} 
            severity={getSeverity(status)} 
            className="text-sm font-medium"
        />
    );
};

export default OrderStatusBadge;
