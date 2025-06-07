import React from 'react';
import { Divider } from 'primereact/divider';
import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils';

interface OrderSummaryProps {
    order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
    return (
        <div className="flex justify-content-start">
            <div className="w-6 lg:w-full">
                <div className="flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(order?.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="font-medium">{formatCurrency(order?.shippingFee ?? 0)}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <span className="font-medium">{formatCurrency(order?.discount ?? 0)}</span>
                </div>
                <Divider />
                <div className="flex justify-content-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(order?.total ?? 0)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
