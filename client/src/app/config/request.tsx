import axios from 'axios';
import { apiClient } from './axiosClient';

// Base axios instance cho các request đơn giản
const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export const requestRegister = async (user: any) => {
    const res = await request.post('/api/users/register', user);
    return res.data;
};

export const requestLogin = async (user: any) => {
    const res = await request.post('/api/users/login', user);
    return res.data;
};

export const requestAuth = async () => {
    const res = await apiClient.get('/api/users/auth');
    return res.data;
};

export const requestRefreshToken = async () => {
    const res = await request.get('/api/users/refresh-token');
    return res.data;
};
