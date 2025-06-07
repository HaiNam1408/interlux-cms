/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dashboardApiRequest, { AllDashboardStatistics } from '@/api/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const chartContainerStyle: React.CSSProperties = {
    width: '100%',
    height: 300
};

const chartColors = {
    'PENDING': '#64B5F6',
    'PROCESSING': '#FFB74D',
    'SHIPPED': '#7986CB',
    'DELIVERED': '#4DB6AC',
    'COMPLETED': '#81C784',
    'CANCELLED': '#E57373',
    'RETURNED': '#BA68C8',
    'REFUNDED': '#F06292'
};

const generateChartData = (revenueByStatus: Record<string, number> | undefined) => {
    if (!revenueByStatus) {
        return [];
    }

    // Transform the data into the format Recharts expects
    return Object.entries(revenueByStatus).map(([status, value]) => ({
        name: status,
        value: value,
        fill: chartColors[status as keyof typeof chartColors] || '#9E9E9E'
    }));
};

interface Product {
    id: number;
    title: string;
    sold: number;
    revenue: number;
}

interface RecentOrder {
    id: number;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    username: string;
}

const statusColors = {
    'PENDING': { background: '#BBDEFB', color: '#1565C0' },
    'PROCESSING': { background: '#FFE0B2', color: '#E65100' },
    'SHIPPED': { background: '#D1C4E9', color: '#4527A0' },
    'DELIVERED': { background: '#B2DFDB', color: '#00695C' },
    'COMPLETED': { background: '#C8E6C9', color: '#2E7D32' },
    'CANCELLED': { background: '#FFCDD2', color: '#B71C1C' },
    'RETURNED': { background: '#E1BEE7', color: '#6A1B9A' },
    'REFUNDED': { background: '#F8BBD0', color: '#880E4F' }
};

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [dashboardStats, setDashboardStats] = useState<AllDashboardStatistics | null>(null);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);

    const fetchDashboardData = async (startDate?: string, endDate?: string) => {
        setLoading(true);
        try {
            const params = startDate && endDate ? { startDate, endDate } : undefined;
            const response = await dashboardApiRequest.getAllStatistics(params);

            if (response.data) {
                setDashboardStats(response.data);
                setTopProducts(response.data.products.topSellingProducts);
                setRecentOrders(response.data.orders.recentOrders);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatCurrency = (value: number) => {
        return formatCurrency(value);
    };

    return (
        <div className="grid">
            {loading && (
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-center align-items-center" style={{ height: '76vh' }}>
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                            <span className="font-medium ml-2">Loading dashboard data...</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Orders</span>
                                    <div className="text-900 font-medium text-xl">{dashboardStats?.sales.totalOrders || 0}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-500 font-medium">Average Order Value: </span>
                            <span className="text-green-500 font-medium">{formatCurrency(dashboardStats?.sales.averageOrderValue || 0)}</span>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Revenue</span>
                                    <div className="text-900 font-medium text-xl">{formatCurrency(dashboardStats?.sales.totalRevenue || 0)}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-money-bill text-orange-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-500 font-medium">From </span>
                            <span className="text-green-500 font-medium">{dashboardStats?.sales.totalOrders || 0} orders</span>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Customers</span>
                                    <div className="text-900 font-medium text-xl">{dashboardStats?.customers.totalCustomers || 0}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-users text-cyan-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">{dashboardStats?.customers.newCustomers || 0} </span>
                            <span className="text-500">newly registered</span>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Products</span>
                                    <div className="text-900 font-medium text-xl">{dashboardStats?.products.totalProducts || 0}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-box text-purple-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-500 font-medium">Variations: </span>
                            <span className="text-green-500 font-medium">{dashboardStats?.products.totalVariations || 0}</span>
                        </div>
                    </div>

                    <div className="col-12 xl:col-6">
                        <div className="card">
                            <h5>Recent Orders</h5>
                            <DataTable value={recentOrders} rows={5} paginator>
                                <Column field="orderNumber" header="Order #" sortable style={{ width: '20%' }} />
                                <Column field="username" header="Customer" sortable style={{ width: '25%' }} />
                                <Column field="total" header="Total" sortable style={{ width: '20%' }} body={(data) => formatCurrency(data.total)} />
                                <Column
                                    field="status"
                                    header="Status"
                                    sortable
                                    style={{ width: '20%' }}
                                    body={(data) => {
                                        const status = data.status as keyof typeof statusColors;
                                        const style = {
                                            backgroundColor: statusColors[status]?.background || '#E0E0E0',
                                            color: statusColors[status]?.color || '#616161',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        };
                                        return <span style={style}>{status}</span>;
                                    }}
                                />
                                <Column
                                    header="View"
                                    style={{ width: '15%' }}
                                    body={(data) => (
                                        <Link href={`/order/${data.id}`}>
                                            <Button icon="pi pi-search" text />
                                        </Link>
                                    )}
                                />
                            </DataTable>
                        </div>
                        <div className="card">
                            <div className="flex justify-content-between align-items-center mb-5">
                                <h5>Top Selling Products</h5>
                                <div>
                                    <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu1.current?.toggle(event)} />
                                    <Menu
                                        ref={menu1}
                                        popup
                                        model={[
                                            { label: 'View All Products', icon: 'pi pi-fw pi-list' },
                                            { label: 'Add New Product', icon: 'pi pi-fw pi-plus' }
                                        ]}
                                    />
                                </div>
                            </div>
                            <ul className="list-none p-0 m-0">
                                {topProducts.map((product, index) => {
                                    const maxRevenue = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.revenue)) : 0;
                                    const percentage = maxRevenue > 0 ? Math.round((product.revenue / maxRevenue) * 100) : 0;

                                    const colors = ['orange', 'cyan', 'pink', 'green', 'purple', 'teal', 'blue', 'yellow', 'indigo', 'red'];
                                    const colorIndex = index % colors.length;
                                    const color = colors[colorIndex];

                                    return (
                                        <li key={product.id} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                            <div>
                                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{product.title}</span>
                                                <div className="mt-1 text-600">Sold: {product.sold} units</div>
                                            </div>
                                            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                                    <div className={`bg-${color}-500 h-full`} style={{ width: `${percentage}%` }} />
                                                </div>
                                                <span className={`text-${color}-500 ml-3 font-medium`}>{formatCurrency(product.revenue)}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                                {topProducts.length === 0 && <li className="text-center p-3">No product data available</li>}
                            </ul>
                        </div>
                    </div>

                    <div className="col-12 xl:col-6">
                        <div className="card">
                            <h5>Revenue by Order Status</h5>
                            <div style={chartContainerStyle}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={generateChartData(dashboardStats?.sales.revenueByStatus)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} labelFormatter={(label) => `Status: ${label}`} />
                                        <Legend />
                                        <Bar dataKey="value" name="Revenue" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex align-items-center justify-content-between mb-4">
                                <h5>Orders by Status</h5>
                                <div>
                                    <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)} />
                                    <Menu
                                        ref={menu2}
                                        popup
                                        model={[
                                            { label: 'View All Orders', icon: 'pi pi-fw pi-list' },
                                            { label: 'Export Data', icon: 'pi pi-fw pi-download' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="grid">
                                {dashboardStats?.orders.ordersByStatus &&
                                    Object.entries(dashboardStats.orders.ordersByStatus).map(([status, count]) => {
                                        const statusColors: Record<string, string> = {
                                            PENDING: 'blue',
                                            PROCESSING: 'orange',
                                            SHIPPED: 'indigo',
                                            DELIVERED: 'teal',
                                            COMPLETED: 'green',
                                            CANCELLED: 'red',
                                            RETURNED: 'purple',
                                            REFUNDED: 'pink'
                                        };

                                        const color = statusColors[status] || 'gray';
                                        const countValue = typeof count === 'number' ? count : 0;

                                        return (
                                            <div key={status} className="col-12 md:col-6 mb-3">
                                                <div className={`bg-${color}-100 p-3 border-round`}>
                                                    <div className="flex justify-content-between align-items-center">
                                                        <div>
                                                            <span className="block text-500 font-medium mb-1">{status}</span>
                                                            <div className={`text-${color}-500 font-medium text-xl`}>{countValue}</div>
                                                        </div>
                                                        <div className={`flex align-items-center justify-content-center bg-${color}-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                                                            <i
                                                                className={`pi pi-${
                                                                    status === 'COMPLETED'
                                                                        ? 'check-circle'
                                                                        : status === 'CANCELLED'
                                                                        ? 'times-circle'
                                                                        : status === 'SHIPPED'
                                                                        ? 'send'
                                                                        : status === 'DELIVERED'
                                                                        ? 'inbox'
                                                                        : status === 'PROCESSING'
                                                                        ? 'sync'
                                                                        : 'shopping-cart'
                                                                } text-${color}-500 text-xl`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                {(!dashboardStats?.orders.ordersByStatus || Object.keys(dashboardStats.orders.ordersByStatus).length === 0) && <div className="col-12 text-center p-3">No order status data available</div>}
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex align-items-center justify-content-between mb-4">
                                <h5>Top Customers</h5>
                            </div>

                            <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                                {dashboardStats?.customers.topCustomers.map((customer: { id: number; username: string; email: string; totalSpent: number; ordersCount: number }) => (
                                    <li key={customer.id} className="flex align-items-center py-2 border-bottom-1 surface-border">
                                        <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                            <i className="pi pi-user text-xl text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-900 font-medium block">{customer.username}</span>
                                            <span className="text-700">{customer.email}</span>
                                        </div>
                                        <div className="flex flex-column align-items-end">
                                            <span className="text-900 font-medium">{formatCurrency(customer.totalSpent)}</span>
                                            <span className="text-700">{customer.ordersCount} orders</span>
                                        </div>
                                    </li>
                                ))}

                                {(!dashboardStats?.customers.topCustomers || dashboardStats.customers.topCustomers.length === 0) && <li className="text-center p-3">No customer data available</li>}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
