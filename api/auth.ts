import httpClient from '@/lib/httpClient';

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    role: string;
    name?: string;
    userId?: string;
}

/**
 * Parses a JWT token to extract user information
 * @param token JWT token string
 * @returns User profile information
 */
export const parseJwtToken = (token: string): UserProfile => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        return {
            id: payload.userId || payload.sub || payload.id || '',
            userId: payload.userId || '',
            email: payload.email || '',
            role: payload.role || '',
            name: payload.name
        };
    } catch (error) {
        throw new Error('Invalid token format');
    }
};

const authService = {
    /**
     * Login with email and password
     * @param data Login credentials
     * @returns Login response with tokens
     */
    login: async (data: LoginDto): Promise<{ user: UserProfile; token: string }> => {
        try {
            const response = await httpClient.post<any>(
                "/auth/login",
                data
            );

            if (!response.data || !response.data.accessToken) {
                throw new Error('Invalid response format');
            }

            const { accessToken } = response.data;
            const user = parseJwtToken(accessToken);
            localStorage.setItem('token', accessToken);

            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            return { user, token: accessToken };
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Login failed');
            } else if (error.message) {
                throw new Error(error.message);
            } else {
                throw new Error('An unexpected error occurred during login');
            }
        }
    },

    /**
     * Check if user is authenticated and get user profile from token
     * @returns User profile if authenticated, null otherwise
     */
    getCurrentUser: (): UserProfile | null => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            return parseJwtToken(token);
        } catch (error) {
            localStorage.removeItem('token');
            return null;
        }
    },

    /**
     * Logout current user
     */
    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    /**
     * Check if user is authenticated
     * @returns true if authenticated, false otherwise
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
