'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { OrderApiService } from '@/service/OrderApiService';
import { Order, OrderStatus, UpdateOrderStatusDto } from '@/types/order';
import { PaginatedData } from '@/types/response';
import {
    OrderTable,
    UpdateOrderStatusDialog
} from '../components';

const RefundsPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updateStatusDialog, setUpdateStatusDialog] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [first, setFirst] = useState<number>(0);
    const toast = useRef<Toast>(null);

    const loadRefundedOrders = useCallback(() => {
        setLoading(true);
        OrderApiService.getRefundedOrders(currentPage, rows, globalFilter)
            .then((response: PaginatedData<Order> | null) => {
                if (response) {
                    setOrders(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setOrders([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error: any) => {
                console.error('Error loading refunded orders:', error);
                setLoading(false);
                
                const errorDetail = error.payload?.message || 'Failed to load refunded orders';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, [currentPage, rows, globalFilter]);

    useEffect(() => {
        loadRefundedOrders();
    }, [loadRefundedOrders]);

    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
        setCurrentPage(1);
        setFirst(0);
    };

    const openUpdateStatusDialog = (order: Order) => {
        setSelectedOrder(order);
        setUpdateStatusDialog(true);
    };

    const hideUpdateStatusDialog = () => {
        setUpdateStatusDialog(false);
        setSelectedOrder(null);
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
            loadRefundedOrders();
        } catch (error: any) {
            console.error('Error updating order status:', error);
            
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

    const rightToolbarTemplate = () => {
        return (
            <Button label="Refresh" icon="pi pi-refresh" className="p-button-outlined" onClick={loadRefundedOrders} />
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            
            <div className="card">
                <Toolbar className="mb-4" start={<h4 className="m-0">Refunded Orders</h4>} end={rightToolbarTemplate}></Toolbar>

                <OrderTable
                    orders={orders}
                    loading={loading}
                    globalFilter={globalFilter}
                    totalRecords={totalRecords}
                    first={first}
                    rows={rows}
                    onPage={onPage}
                    onGlobalFilterChange={onGlobalFilterChange}
                    onStatusChange={openUpdateStatusDialog}
                    title="Refunded Orders"
                />

                <UpdateOrderStatusDialog
                    visible={updateStatusDialog}
                    order={selectedOrder}
                    onHide={hideUpdateStatusDialog}
                    onUpdateStatus={updateOrderStatus}
                />
            </div>
        </div>
    );
};

export default RefundsPage;
