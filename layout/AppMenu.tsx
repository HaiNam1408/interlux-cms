/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Store Management',
            items: [
                {
                    label: 'Products',
                    icon: 'pi pi-fw pi-box',
                    items: [
                        {
                            label: 'Categories',
                            icon: 'pi pi-fw pi-list',
                            to: '/pages/category'
                        },
                        {
                            label: 'Products',
                            icon: 'pi pi-fw pi-box',
                            to: '/pages/product'
                        }
                    ]
                },
                {
                    label: 'Orders',
                    icon: 'pi pi-fw pi-shopping-cart',
                    items: [
                        {
                            label: 'All Orders',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: '/pages/order'
                        },
                        {
                            label: 'Returns',
                            icon: 'pi pi-fw pi-replay',
                            to: '/pages/order/returns'
                        },
                        {
                            label: 'Refunds',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/pages/order/refunds'
                        }
                    ]
                },
                {
                    label: 'Customers',
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/customer'
                },
                {
                    label: 'Inventory',
                    icon: 'pi pi-fw pi-database',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Marketing & Sales',
            items: [
                {
                    label: 'Coupon',
                    icon: 'pi pi-fw pi-ticket',
                    to: '/pages/coupon'
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Content Management',
            items: [
                {
                    label: 'Blog Posts',
                    icon: 'pi pi-fw pi-file-o',
                    to: '/pages/blog'
                },
                {
                    label: 'Tags',
                    icon: 'pi pi-fw pi-tags',
                    to: '/pages/tag'
                },
                {
                    label: 'Banners',
                    icon: 'pi pi-fw pi-image',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Analytics & Reports',
            items: [
                {
                    label: 'Sales Overview',
                    icon: 'pi pi-fw pi-tag',
                    to: '/pages/empty'
                },
                {
                    label: 'Top Products',
                    icon: 'pi pi-fw pi-star-fill',
                    to: '/pages/empty'
                },
                {
                    label: 'Customer Insights',
                    icon: 'pi pi-fw pi-eye',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'Store Info',
                    icon: 'pi pi-fw pi-desktop',
                    to: '/pages/empty'
                },
                {
                    label: 'Payment & Shipping',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/pages/empty'
                },
                {
                    label: 'Staff',
                    icon: 'pi pi-fw pi-user',
                    to: '/pages/empty'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-sign-out',
                    to: '/pages/empty'
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
