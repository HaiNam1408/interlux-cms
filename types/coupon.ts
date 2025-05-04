import { CommonStatus } from "./product";

export enum CouponType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export interface Coupon {
    id: number;
    code: string;
    type: CouponType;
    value: number;
    minPurchase?: number;
    maxUsage?: number;
    startDate: string;
    endDate: string;
    status: CommonStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCouponDto {
    code: string;
    type: CouponType;
    value: number;
    minPurchase?: number;
    maxUsage?: number;
    startDate: string;
    endDate: string;
    status?: CommonStatus;
}

export interface UpdateCouponDto {
    code?: string;
    type?: CouponType;
    value?: number;
    minPurchase?: number;
    maxUsage?: number;
    startDate?: string;
    endDate?: string;
    status?: CommonStatus;
}

export interface CouponQueryParams {
    page?: number;
    limit?: number;
    status?: CommonStatus;
}
