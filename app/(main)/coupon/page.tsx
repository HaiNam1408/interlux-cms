'use client';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CouponApiService } from '@/service/CouponApiService';
import { Coupon, CreateCouponDto, UpdateCouponDto } from '@/types/coupon';
import { PaginatedData } from '@/types/response';
import {
    CouponTable,
    CouponForm,
    DeleteCouponDialog,
    DeleteCouponsDialog
} from './components';

const CouponPage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [selectedCoupons, setSelectedCoupons] = useState<Coupon[]>([]);
    const [couponDialog, setCouponDialog] = useState(false);
    const [deleteCouponDialog, setDeleteCouponDialog] = useState(false);
    const [deleteCouponsDialog, setDeleteCouponsDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Coupon[]>>(null);

    const loadCoupons = useCallback(() => {
        setLoading(true);
        CouponApiService.getCoupons(currentPage, rows)
            .then((response: PaginatedData<Coupon> | null) => {
                if (response) {
                    setCoupons(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setCoupons([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error: any) => {
                setLoading(false);

                const errorDetail = error.payload?.message || 'Failed to load coupons';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, [currentPage, rows]);

    useEffect(() => {
        loadCoupons();
    }, [loadCoupons]);

    const openNew = () => {
        setCoupon(null);
        setCouponDialog(true);
    };

    const hideDialog = () => {
        setCouponDialog(false);
    };

    const hideDeleteCouponDialog = () => {
        setDeleteCouponDialog(false);
    };

    const hideDeleteCouponsDialog = () => {
        setDeleteCouponsDialog(false);
    };

    const saveCoupon = async (data: CreateCouponDto | UpdateCouponDto, isNew: boolean) => {
        try {
            if (isNew) {
                await CouponApiService.createCoupon(data as CreateCouponDto);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Coupon created successfully',
                    life: 3000
                });
                setCouponDialog(false);
                loadCoupons();
            } else if (coupon) {
                await CouponApiService.updateCoupon(coupon.id, data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Coupon updated successfully',
                    life: 3000
                });
                setCouponDialog(false);
                loadCoupons();
            }
        } catch (error: any) {
            throw error;
        }
    };

    const editCoupon = (coupon: Coupon) => {
        setCoupon({ ...coupon });
        setCouponDialog(true);
    };

    const confirmDeleteCoupon = (coupon: Coupon) => {
        setCoupon(coupon);
        setDeleteCouponDialog(true);
    };

    const deleteCoupon = async () => {
        try {
            if (coupon) {
                await CouponApiService.deleteCoupon(coupon.id);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Coupon deleted successfully',
                    life: 3000
                });
                setDeleteCouponDialog(false);
                setCoupon(null);
                loadCoupons();
            }
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.payload?.message || 'Failed to delete coupon',
                life: 3000
            });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteCouponsDialog(true);
    };

    const deleteSelectedCoupons = async () => {
        try {
            const promises = selectedCoupons.map(coupon => CouponApiService.deleteCoupon(coupon.id));
            await Promise.all(promises);
            
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Selected coupons deleted successfully',
                life: 3000
            });
            
            setDeleteCouponsDialog(false);
            setSelectedCoupons([]);
            loadCoupons();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.payload?.message || 'Failed to delete selected coupons',
                life: 3000
            });
        }
    };

    const onPage = (e: { first: number; rows: number; page: number }) => {
        setFirst(e.first);
        setRows(e.rows);
        setCurrentPage(e.page + 1);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCoupons || selectedCoupons.length === 0} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-refresh" onClick={loadCoupons} />
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <CouponTable
                    coupons={coupons}
                    selectedCoupons={selectedCoupons}
                    loading={loading}
                    globalFilter={globalFilter}
                    totalRecords={totalRecords}
                    first={first}
                    rows={rows}
                    dt={dt}
                    onSelectionChange={(e) => setSelectedCoupons(e.value)}
                    onPage={onPage}
                    onGlobalFilterChange={onGlobalFilterChange}
                    editCoupon={editCoupon}
                    confirmDeleteCoupon={confirmDeleteCoupon}
                />

                <CouponForm
                    visible={couponDialog}
                    coupon={coupon}
                    onHide={hideDialog}
                    onSave={saveCoupon}
                />

                <DeleteCouponDialog
                    visible={deleteCouponDialog}
                    coupon={coupon}
                    onHide={hideDeleteCouponDialog}
                    onDelete={deleteCoupon}
                />

                <DeleteCouponsDialog
                    visible={deleteCouponsDialog}
                    coupons={selectedCoupons}
                    onHide={hideDeleteCouponsDialog}
                    onDelete={deleteSelectedCoupons}
                />
            </div>
        </div>
    );
};

export default CouponPage;
