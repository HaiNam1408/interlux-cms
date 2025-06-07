import React from 'react';
import { Divider } from 'primereact/divider';
import { Order } from '@/types/order';

interface OrderSummaryProps {
    order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
    return (
        <div className="flex justify-content-start">
            <div className="w-6 lg:w-full">
                <div className="flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">${order?.subtotal ?? '0'}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="font-medium">{order?.shippingFee ?? '0'}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <span className="font-medium">{order?.discount ?? '0'}</span>
                </div>
                <Divider />
                <div className="flex justify-content-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">${order?.total ?? '0'}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
