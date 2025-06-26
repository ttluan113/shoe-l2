import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { requestRefreshToken } from './request';
// ApiClient class với auto refresh token
export class ApiClient {
    private baseURL: string = process.env.NEXT_PUBLIC_API_URL || '';
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
    }> = [];

    constructor(baseURL?: string) {
        this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || '';
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Response interceptor - xử lý lỗi 401
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                if (error.response?.status === 401 && !originalRequest._retry) {
                    // Kiểm tra xem có cookie 'logged' không để biết user đã login chưa
                    if (!this.isLoggedIn()) {
                        this.handleAuthFailure();
                        return Promise.reject(error);
                    }

                    if (this.isRefreshing) {
                        // Nếu đang refresh token, thêm request vào queue
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then(() => {
                                // Sau khi refresh xong, retry request
                                return this.axiosInstance(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        await this.refreshToken();
                        this.processQueue(null);

                        // Retry original request - cookies mới sẽ tự động được gửi
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError);
                        this.handleAuthFailure();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    private async refreshToken(): Promise<void> {
        try {
            // Sử dụng endpoint refresh token của bạn
            await requestRefreshToken();

            console.log('Token refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
        }
    }

    private processQueue(error: any): void {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(null);
            }
        });

        this.failedQueue = [];
    }

    private handleAuthFailure(): void {
        // Gọi API logout để xóa cookies từ server
        this.logout().finally(() => {
            // Redirect đến trang login hoặc dispatch event
            window.location.href = '/login';
            // hoặc: window.dispatchEvent(new CustomEvent('auth:logout'));
        });
    }

    // Kiểm tra trạng thái login từ cookie 'logged'
    private isLoggedIn(): boolean {
        return Cookies.get('logged') === '1';
    }

    // Method để logout
    public async logout(): Promise<void> {
        try {
            await this.axiosInstance.get('/api/users/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Method để check trạng thái login
    public checkAuthStatus(): boolean {
        return this.isLoggedIn();
    }

    // Public methods để sử dụng
    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete(url, config);
    }

    public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch(url, data, config);
    }
}

// Export instance để sử dụng trong toàn bộ app với auto refresh token
export const apiClient = new ApiClient();
