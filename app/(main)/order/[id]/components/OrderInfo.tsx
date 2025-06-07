import React from 'react';
import { Order } from '@/types/order';

interface OrderInfoProps {
    order: Order;
    formatDate: (dateString: string) => string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order, formatDate }) => {
    return (
        <div className="col-12 md:col-6">
            <h4>Order Information</h4>
            <div className="flex flex-column gap-2">
                <div>
                    <span className="font-semibold">Date:</span> {formatDate(order.createdAt)}
                </div>
                <div>
                    <span className="font-semibold">Payment Method:</span> {order.payment.method}
                </div>
                <div>
                    <span className="font-semibold">Payment Status:</span> {order.payment.status}
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
