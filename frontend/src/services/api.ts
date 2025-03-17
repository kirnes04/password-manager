import axios from 'axios';
import {
    AuthResponse,
    CreateRecordRequest,
    Directory,
    Record,
    ShareRecordRequest,
    SignInRequest,
    SignUpRequest
} from '../types';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signIn: (data: SignInRequest) => api.post<AuthResponse>('/auth/signin', data),
    signUp: (data: SignUpRequest) => api.post<AuthResponse>('/auth/signup', data),
};

export const recordsAPI = {
    getAll: (directoryId: number = 0) => api.get<Record[]>(`/records?directoryId=${directoryId}`),
    getById: (id: number) => api.get<Record>(`/records/${id}`),
    create: (data: CreateRecordRequest, directoryId: number = 0) =>
        api.post<Record>(`/records?directoryId=${directoryId}`, data),
    update: (id: number, data: Record) => api.put<Record>(`/records/${id}`, data),
    delete: (id: number) => api.delete(`/records/${id}`),
    move: (recordId: number, directoryId: number) =>
        api.patch<Record>(`/records/${recordId}?directoryId=${directoryId}`),
    share: (data: ShareRecordRequest) => api.post<{ token: string }>('/records/share', data),
    useToken: (token: string) => api.get<Record>(`/records/useToken/${token}`),
};

export const directoriesAPI = {
    getAll: (parentId: number = 0) => api.get<Directory[]>(`/directory?parentId=${parentId}`),
    create: (name: string, parentId: number = 0) =>
        api.post<Directory>(`/directory?parentId=${parentId}`, name),
}; 