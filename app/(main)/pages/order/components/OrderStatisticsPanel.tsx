import React from 'react';
import { Card } from 'primereact/card';
import { OrderStatistics, OrderStatus } from '@/types/order';
import { Skeleton } from 'primereact/skeleton';

interface OrderStatisticsPanelProps {
    statistics: OrderStatistics | null;
    loading: boolean;
}

const OrderStatisticsPanel: React.FC<OrderStatisticsPanelProps> = ({ statistics, loading }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const statCards = [
        {
            title: 'Total Orders',
            value: statistics?.totalOrders || 0,
            icon: 'pi pi-shopping-cart',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Total Sales',
            value: formatCurrency(statistics?.totalSales as number),
            icon: 'pi pi-dollar',
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Completed',
            value: statistics?.completedOrders || 0,
            icon: 'pi pi-check-circle',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            title: 'Processing',
            value: statistics?.processingOrders || 0,
            icon: 'pi pi-sync',
            color: 'bg-cyan-100 text-cyan-600'
        },
        {
            title: 'Shipped',
            value: statistics?.shippedOrders || 0,
            icon: 'pi pi-send',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            title: 'Delivered',
            value: statistics?.deliveredOrders || 0,
            icon: 'pi pi-check-circle',
            color: 'bg-teal-100 text-teal-600'
        },
        {
            title: 'Cancelled',
            value: statistics?.cancelledOrders || 0,
            icon: 'pi pi-times-circle',
            color: 'bg-pink-100 text-pink-600'
        },
        {
            title: 'Returned',
            value: statistics?.returnedOrders || 0,
            icon: 'pi pi-replay',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            title: 'Refunded',
            value: statistics?.refundedOrders || 0,
            icon: 'pi pi-wallet',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    return (
        <div className="grid">
            {/* First row - Main statistics */}
            <div className="col-12 md:col-6 lg:col-4 p-2">
                <Card className="shadow-2 h-full">
                    {loading ? (
                        <div className="flex flex-column align-items-center">
                            <Skeleton width="60%" height="2rem" className="mb-2"></Skeleton>
                            <Skeleton width="60%" height="4rem"></Skeleton>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center justify-content-center p-3">
                            <div className={`flex align-items-center justify-content-center border-round-xl bg-blue-100 text-blue-600 mb-3`} style={{ width: '5rem', height: '5rem' }}>
                                <i className="pi pi-shopping-cart text-4xl"></i>
                            </div>
                            <div className="text-900 font-bold text-4xl mb-2">{statistics?.totalOrders || 0}</div>
                            <div className="text-500 font-medium text-xl">Total Orders</div>
                        </div>
                    )}
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-4 p-2">
                <Card className="shadow-2 h-full">
                    {loading ? (
                        <div className="flex flex-column align-items-center">
                            <Skeleton width="60%" height="2rem" className="mb-2"></Skeleton>
                            <Skeleton width="60%" height="4rem"></Skeleton>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center justify-content-center p-3">
                            <div className={`flex align-items-center justify-content-center border-round-xl bg-green-100 text-green-600 mb-3`} style={{ width: '5rem', height: '5rem' }}>
                                <i className="pi pi-dollar text-4xl"></i>
                            </div>
                            <div className="text-900 font-bold text-4xl mb-2">{formatCurrency(statistics?.totalSales as number)}</div>
                            <div className="text-500 font-medium text-xl">Total Sales</div>
                        </div>
                    )}
                </Card>
            </div>

            <div className="col-12 lg:col-4 p-2">
                <Card className="shadow-2 h-full">
                    {loading ? (
                        <div className="flex flex-column align-items-center">
                            <Skeleton width="60%" height="2rem" className="mb-2"></Skeleton>
                            <Skeleton width="60%" height="4rem"></Skeleton>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center justify-content-center p-3">
                            <div className={`flex align-items-center justify-content-center border-round-xl bg-cyan-200 text-cyan-700 mb-3`} style={{ width: '5rem', height: '5rem' }}>
                                <i className="pi pi-check text-4xl"></i>
                            </div>
                            <div className="text-900 font-bold text-4xl mb-2">{statistics?.completedOrders || 0}</div>
                            <div className="text-500 font-medium text-xl">Completed Orders</div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Second row - Order status counts */}
            <div className="col-12 p-2">
                <Card className="shadow-1">
                    <h5 className="mb-3">Order Status Breakdown</h5>
                    <div className="grid">
                        {statCards.slice(3).map((card, index) => (
                            <div key={index} className="col-6 sm:col-4 lg:col-2 p-2">
                                <div className="border-1 border-round surface-border p-3 h-full">
                                    {loading ? (
                                        <div className="flex flex-column align-items-center">
                                            <Skeleton width="60%" height="1.5rem" className="mb-2"></Skeleton>
                                            <Skeleton width="40%" height="2rem"></Skeleton>
                                        </div>
                                    ) : (
                                        <div className="flex flex-column align-items-center">
                                            <div className={`flex align-items-center justify-content-center border-round-xl ${card.color} mb-2`} style={{ width: '3rem', height: '3rem' }}>
                                                <i className={`${card.icon} text-lg`}></i>
                                            </div>
                                            <div className="text-900 font-bold text-xl mb-1">{card.value}</div>
                                            <div className="text-500 font-medium text-center">{card.title}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OrderStatisticsPanel;
