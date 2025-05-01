import axios from 'axios';

// Lấy API base URL từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

// Tạo instance axios với cấu hình mặc định
export const http = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Thêm interceptor để xử lý token
http.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage nếu có
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        // Nếu có token, thêm vào header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response
http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Xóa token và chuyển hướng đến trang đăng nhập
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }
        }
        
        return Promise.reject(error);
    }
);

// Hàm helper để xử lý multipart/form-data
export const httpFormData = {
    post: (url: string, data: FormData) => {
        return http.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    patch: (url: string, data: FormData) => {
        return http.patch(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default http;
