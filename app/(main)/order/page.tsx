'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { OrderApiService } from '@/service/OrderApiService';
import { Order, OrderStatus, UpdateOrderStatusDto } from '@/types/order';
import { PaginatedData } from '@/types/response';
import {
    OrderTable,
    UpdateOrderStatusDialog,
    OrderStatisticsPanel
} from './components';

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updateStatusDialog, setUpdateStatusDialog] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [statsLoading, setStatsLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [first, setFirst] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [statistics, setStatistics] = useState<any>(null);
    const toast = useRef<Toast>(null);

    const getStatusForTab = (tabIndex: number): OrderStatus | undefined => {
        switch (tabIndex) {
            case 0: return undefined; // All orders
            case 1: return OrderStatus.PENDING;
            case 2: return OrderStatus.PROCESSING;
            case 3: return OrderStatus.SHIPPED;
            case 4: return OrderStatus.DELIVERED;
            case 5: return OrderStatus.CANCELLED;
            default: return undefined;
        }
    };

    const loadOrders = useCallback(() => {
        setLoading(true);
        const status = getStatusForTab(activeTab);

        OrderApiService.getOrders(currentPage, rows, status, globalFilter)
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
                setLoading(false);

                const errorDetail = error.payload?.message || 'Failed to load orders';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, [currentPage, rows, globalFilter, activeTab]);

    const loadStatistics = useCallback(() => {
        setStatsLoading(true);
        OrderApiService.getOrderStatistics()
            .then((response) => {
                if (response) {
                    setStatistics(response);
                }
                setStatsLoading(false);
            })
            .catch((error) => {
                setStatsLoading(false);

                const errorDetail = error.payload?.message || 'Failed to load order statistics';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

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

    const onTabChange = (e: { index: number }) => {
        setActiveTab(e.index);
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
            loadOrders();
            loadStatistics();
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

    const rightToolbarTemplate = () => {
        return (
            <Button label="Refresh" icon="pi pi-refresh" className="p-button-outlined" onClick={loadOrders} />
        );
    };

    return (
        <div>
            <Toast ref={toast} />

            <div className="card mb-4">
                <div className="flex align-items-center justify-content-between mb-3">
                    <h3 className="m-0">Order Dashboard</h3>
                    <Button
                        icon="pi pi-refresh"
                        text
                        onClick={loadStatistics}
                        loading={statsLoading}
                        tooltip="Refresh Statistics"
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>
                <OrderStatisticsPanel statistics={statistics} loading={statsLoading} />
            </div>

            <div className="card">
                <Toolbar className="mb-4" start={<h4 className="m-0">Order Management</h4>} end={rightToolbarTemplate}></Toolbar>

                <TabView activeIndex={activeTab} onTabChange={onTabChange}>
                    <TabPanel header="All Orders">
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
                            title="All Orders"
                        />
                    </TabPanel>
                    <TabPanel header="Pending">
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
                            title="Pending Orders"
                        />
                    </TabPanel>
                    <TabPanel header="Processing">
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
                            title="Processing Orders"
                        />
                    </TabPanel>
                    <TabPanel header="Shipped">
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
                            title="Shipped Orders"
                        />
                    </TabPanel>
                    <TabPanel header="Delivered">
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
                            title="Delivered Orders"
                        />
                    </TabPanel>
                    <TabPanel header="Cancelled">
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
                            title="Cancelled Orders"
                        />
                    </TabPanel>
                </TabView>

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

export default OrderPage;
