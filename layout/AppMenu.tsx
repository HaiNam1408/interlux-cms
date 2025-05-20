/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {

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
                            to: '/category'
                        },
                        {
                            label: 'Products',
                            icon: 'pi pi-fw pi-box',
                            to: '/product'
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
                            to: '/order'
                        },
                        {
                            label: 'Returns',
                            icon: 'pi pi-fw pi-replay',
                            to: '/order/returns'
                        },
                        {
                            label: 'Refunds',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/order/refunds'
                        }
                    ]
                },
                {
                    label: 'Customers',
                    icon: 'pi pi-fw pi-users',
                    to: '/customer'
                },
                {
                    label: 'Inventory',
                    icon: 'pi pi-fw pi-database',
                    to: '/empty'
                }
            ]
        },
        {
            label: 'Marketing & Sales',
            items: [
                {
                    label: 'Coupon',
                    icon: 'pi pi-fw pi-ticket',
                    to: '/coupon'
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/empty'
                }
            ]
        },
        {
            label: 'Content Management',
            items: [
                {
                    label: 'Blog Posts',
                    icon: 'pi pi-fw pi-file-o',
                    to: '/blog'
                },
                {
                    label: 'Tags',
                    icon: 'pi pi-fw pi-tags',
                    to: '/tag'
                },
                {
                    label: 'Banners',
                    icon: 'pi pi-fw pi-image',
                    to: '/empty'
                }
            ]
        },
        {
            label: 'Analytics & Reports',
            items: [
                {
                    label: 'Sales Overview',
                    icon: 'pi pi-fw pi-tag',
                    to: '/empty'
                },
                {
                    label: 'Top Products',
                    icon: 'pi pi-fw pi-star-fill',
                    to: '/empty'
                },
                {
                    label: 'Customer Insights',
                    icon: 'pi pi-fw pi-eye',
                    to: '/empty'
                }
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'Store Info',
                    icon: 'pi pi-fw pi-desktop',
                    to: '/empty'
                },
                {
                    label: 'Payment & Shipping',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/empty'
                },
                {
                    label: 'Staff',
                    icon: 'pi pi-fw pi-user',
                    to: '/empty'
                },
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
