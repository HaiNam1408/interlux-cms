'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { OrderApiService } from '@/service/OrderApiService';
import { Order, UpdateOrderStatusDto } from '@/types/order';
import { UpdateOrderStatusDialog, OrderStatusBadge } from '../components';
import {
    OrderHeader,
    OrderCustomerInfo,
    OrderInfo,
    ShippingAddressInfo,
    OrderItemsTable,
    OrderSummary,
    OrderNotFound,
    OrderDetailSkeleton
} from './components';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateStatusDialog, setUpdateStatusDialog] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const loadOrder = useCallback(() => {
        setLoading(true);
        OrderApiService.getOrderById(Number(id))
            .then((response) => {
                if (response) {
                    setOrder(response);
                }
                setLoading(false);
            })
            .catch((error: any) => {
                setLoading(false);

                const errorDetail = error.payload?.message || 'Failed to load order details';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, [id]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    const openUpdateStatusDialog = () => {
        setUpdateStatusDialog(true);
    };

    const hideUpdateStatusDialog = () => {
        setUpdateStatusDialog(false);
    };

    const updateOrderStatus = async (orderId: number, data: UpdateOrderStatusDto) => {
        try {
            await OrderApiService.updateOrderStatus(orderId, data);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Order status updated successfully',
                life: 3000
            });
            loadOrder();
        } catch (error: any) {
            const errorDetail = error.payload?.message || 'Failed to update order status';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 3000
            });
            throw error;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div>
            <Toast ref={toast} />

            <OrderHeader order={order} loading={loading} onUpdateStatus={openUpdateStatusDialog} />

            {loading ? (
                <OrderDetailSkeleton />
            ) : order ? (
                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Order #{order.orderNumber}</h3>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="grid">
                                <OrderCustomerInfo order={order} />
                                <OrderInfo order={order} formatDate={formatDate} />
                            </div>

                            <Divider />

                            <ShippingAddressInfo shippingAddress={order.shippingAddress} />

                            <Divider />

                            <OrderItemsTable items={order.items} />

                            {order.notes && (
                                <>
                                    <Divider />
                                    <div>
                                        <h4>Notes</h4>
                                        <p>{order.notes}</p>
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>

                    <div className="col-12 lg:col-4">
                        <Card>
                            <h3>Order Summary</h3>
                            <OrderSummary order={order} />
                        </Card>
                    </div>
                </div>
            ) : (
                <OrderNotFound />
            )}

            {order && <UpdateOrderStatusDialog visible={updateStatusDialog} order={order} onHide={hideUpdateStatusDialog} onUpdateStatus={updateOrderStatus} />}
        </div>
    );
};

export default OrderDetailsPage;
