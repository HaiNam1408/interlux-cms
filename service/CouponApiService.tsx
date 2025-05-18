import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Coupon, CouponQueryParams, CreateCouponDto, UpdateCouponDto } from '@/types/coupon';

export const CouponApiService = {
    async getCoupons(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedData<Coupon> | null> {
        try {
            const queryParams: CouponQueryParams = {
                page,
                limit,
                status: status as any
            };

            const response = await http.get<any>('/coupon', {
                params: queryParams
            });

            if (response.data) {
                return {
                    data: response.data.data || [],
                    meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching coupons:', error);
            return null;
        }
    },

    async getCouponById(id: number): Promise<Coupon | null> {
        try {
            const response = await http.get<any>(`/coupon/${id}`);
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching coupon ${id}:`, error);
            return null;
        }
    },

    async getCouponByCode(code: string): Promise<Coupon | null> {
        try {
            const response = await http.get<any>(`/coupon/code/${code}`);
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching coupon with code ${code}:`, error);
            return null;
        }
    },

    async createCoupon(coupon: CreateCouponDto): Promise<Coupon | null> {
        try {
            const response = await http.post<any>('/coupon', coupon);
            return response.data || null;
        } catch (error) {
            console.error('Error creating coupon:', error);
            throw error;
        }
    },

    async updateCoupon(id: number, coupon: UpdateCouponDto): Promise<Coupon | null> {
        try {
            const response = await http.put<any>(`/coupon/${id}`, coupon);
            return response.data || null;
        } catch (error) {
            console.error(`Error updating coupon ${id}:`, error);
            throw error;
        }
    },

    async deleteCoupon(id: number): Promise<boolean> {
        try {
            await http.delete<any>(`/coupon/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting coupon ${id}:`, error);
            throw error;
        }
    }
};
