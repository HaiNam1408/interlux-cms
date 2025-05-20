import React from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { OrderStatusHistory as OrderStatusHistoryType } from '@/types/order';
import { OrderStatusBadge } from '..';

interface OrderStatusHistoryProps {
    statusHistory?: OrderStatusHistoryType[];
    formatDate: (dateString: string) => string;
}

const OrderStatusHistory: React.FC<OrderStatusHistoryProps> = ({ statusHistory, formatDate }) => {
    const statusHistoryTemplate = (item: OrderStatusHistoryType) => {
        return (
            <div className="flex flex-column">
                <div className="flex align-items-center gap-2">
                    <OrderStatusBadge status={item.status} />
                    <span className="font-medium">{formatDate(item.createdAt)}</span>
                </div>
                {item.note && (
                    <div className="text-sm text-500 mt-1">{item.note}</div>
                )}
            </div>
        );
    };

    return (
        <Card>
            <h3>Order Status History</h3>
            {statusHistory && statusHistory.length > 0 ? (
                <Timeline
                    value={statusHistory}
                    content={statusHistoryTemplate}
                    className="customized-timeline"
                />
            ) : (
                <div className="p-3 text-center">No status history available</div>
            )}
        </Card>
    );
};

export default OrderStatusHistory;
