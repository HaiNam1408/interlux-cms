import React from 'react';
import { Order } from '@/types/order';

interface OrderCustomerInfoProps {
    order: Order;
}

const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({ order }) => {
    return (
        <div className="col-12 md:col-6">
            <h4>Customer Information</h4>
            <div className="flex flex-column gap-2">
                <div>
                    <span className="font-semibold">Name:</span> {order.user.username}
                </div>
                <div>
                    <span className="font-semibold">Email:</span> {order.user.email}
                </div>
                <div>
                    <span className="font-semibold">Phone:</span> {order.user.phone}
                </div>
            </div>
        </div>
    );
};

export default OrderCustomerInfo;
