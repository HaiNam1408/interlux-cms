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
                            to: '/pages/crud'
                        },
                        {
                            label: 'Returns',
                            icon: 'pi pi-fw pi-replay',
                            to: '/pages/crud'
                        },
                        {
                            label: 'Refunds',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/pages/crud'
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
                    to: '/pages/crud'
                }
            ]
        },
        {
            label: 'Marketing & Sales',
            items: [
                {
                    label: 'Coupon',
                    icon: 'pi pi-fw pi-ticket',
                    to: '/pages/crud'
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/crud'
                }
            ]
        },
        {
            label: 'Content Management',
            items: [
                {
                    label: 'Navigation',
                    icon: 'pi pi-fw pi-align-left',
                    to: '/pages/crud'
                },
                {
                    label: 'Blog',
                    icon: 'pi pi-fw pi-file-o',
                    to: '/pages/crud'
                },
                {
                    label: 'Banners',
                    icon: 'pi pi-fw pi-image',
                    to: '/pages/crud'
                }
            ]
        },
        {
            label: 'Analytics & Reports',
            items: [
                {
                    label: 'Sales Overview',
                    icon: 'pi pi-fw pi-tag',
                    to: '/pages/crud'
                },
                {
                    label: 'Top Products',
                    icon: 'pi pi-fw pi-star-fill',
                    to: '/pages/crud'
                },
                {
                    label: 'Customer Insights',
                    icon: 'pi pi-fw pi-eye',
                    to: '/pages/crud'
                }
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'Store Info',
                    icon: 'pi pi-fw pi-desktop',
                    to: '/pages/crud'
                },
                {
                    label: 'Payment & Shipping',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/pages/crud'
                },
                {
                    label: 'Staff',
                    icon: 'pi pi-fw pi-user',
                    to: '/pages/crud'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-sign-out',
                    to: '/pages/crud'
                }
            ]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    to: '/landing'
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/pages/crud'
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    to: '/pages/notfound'
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-question',
                    to: '/documentation'
                },
                {
                    label: 'View Source',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/primefaces/sakai-react',
                    target: '_blank'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
