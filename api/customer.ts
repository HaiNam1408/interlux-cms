import http from "@/lib/http";
import { Customer, CustomerQueryParams, CreateCustomerDto, UpdateCustomerDto, CustomerOrder } from "@/types/customer";
import { SingleResponse, PaginationResponse } from "@/types/response";

const customerApiRequest = {
    /**
     * Get all customers with pagination
     * @param params Query parameters for pagination and filtering
     * @returns Paginated list of customers
     */
    getAll: (params?: CustomerQueryParams) =>
        http.get<PaginationResponse<Customer[]>>(
            "/customer",
            { params }
        ),

    /**
     * Get a customer by ID
     * @param id Customer ID
     * @returns Customer details
     */
    getById: (id: number) =>
        http.get<SingleResponse<Customer>>(
            `/customer/${id}`
        ),

    /**
     * Create a new customer
     * @param data Customer data
     * @returns The created customer
     */
    create: (data: FormData) =>
        http.post<SingleResponse<Customer>>(
            "/customer",
            data
        ),

    /**
     * Update an existing customer
     * @param id Customer ID
     * @param data Updated customer data
     * @returns The updated customer
     */
    update: (id: number, data: FormData) =>
        http.put<SingleResponse<Customer>>(
            `/customer/${id}`,
            data
        ),

    /**
     * Delete a customer
     * @param id Customer ID
     * @returns Success response
     */
    delete: (id: number) =>
        http.delete<SingleResponse<{ success: boolean }>>(
            `/customer/${id}`
        ),
        
    /**
     * Get customer orders
     * @param id Customer ID
     * @param page Page number
     * @param limit Items per page
     * @returns Paginated list of customer orders
     */
    getOrders: (id: number, page: number = 1, limit: number = 10) =>
        http.get<PaginationResponse<CustomerOrder[]>>(
            `/customer/${id}/orders`,
            { params: { page, limit } }
        ),
};

export default customerApiRequest;
