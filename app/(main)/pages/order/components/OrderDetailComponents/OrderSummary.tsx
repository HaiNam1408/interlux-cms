import React from 'react';
import { Divider } from 'primereact/divider';

interface OrderSummaryProps {
    total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ total }) => {
    return (
        <div className="flex justify-content-end">
            <div className="w-full md:w-6 lg:w-4">
                <div className="flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span className="font-medium">$0.00</span>
                </div>
                <Divider />
                <div className="flex justify-content-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
