import axios, { AxiosError } from 'axios';
import {
    AuthResponse,
    CreateRecordRequest,
    Directory,
    Record,
    ShareRecordRequest,
    ShareTokenResponse,
    SignInRequest,
    SignUpRequest
} from '../types';

const API_URL = 'http://localhost:8080';

export const api = axios.create({
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
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signIn: (data: SignInRequest) => 
        api.post<AuthResponse>('/auth/signin', data)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('An unexpected error occurred during sign in');
            }),
    signUp: (data: SignUpRequest) => 
        api.post<AuthResponse>('/auth/signup', data)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('An unexpected error occurred during sign up');
            }),
};

export const recordsAPI = {
    getAll: (directoryId: number = 0) => 
        api.get<Record[]>(`/records?directoryId=${directoryId}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch records');
            }),

    getById: (id: number) => 
        api.get<Record>(`/records/${id}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 404) {
                    throw new Error('Record not found');
                }
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch record details');
            }),

    create: (data: CreateRecordRequest, directoryId: number = 0) =>
        api.post<Record>(`/records?directoryId=${directoryId}`, data)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to create record');
            }),

    update: (id: number, data: Record) => 
        api.put<Record>(`/records/${id}`, data)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to update record');
            }),

    delete: (id: number) => 
        api.delete(`/records/${id}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 404) {
                    throw new Error('Record not found');
                }
                throw new Error('Failed to delete record');
            }),

    move: (recordId: number, directoryId: number) =>
        api.patch<Record>(`/records/${recordId}?directoryId=${directoryId}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to move record');
            }),

    share: (recordId: number, expirationDate: string) => 
        api.post<ShareTokenResponse>(
            '/records/share', 
            { record_id: recordId, expirationDate: new Date(expirationDate) }
        ).catch((error: AxiosError) => {
            if (error.response?.status === 400) {
                throw new Error(error.response.data as string);
            }
            throw new Error('Failed to share record');
        }),

    useToken: (token: string, directoryId: number) => 
        api.get<Record>(`/records/useToken/${token}?directoryId=${directoryId}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    const errorMessage = error.response.data as string;
                    if (errorMessage === 'This token is already used') {
                        throw new Error('This share link has already been used');
                    } else if (errorMessage === 'This token is expired') {
                        throw new Error('This share link has expired');
                    }
                    throw new Error(errorMessage);
                }
                throw new Error('Failed to use share token');
            }),
};

export const directoriesAPI = {
    getAll: (parentId: number) => 
        api.get<Directory[]>(`/directory?parentId=${parentId}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch directories');
            }),

    create: (name: string, parentId: number) => 
        api.post<Directory>(`/directory`, name, {
            params: { parentId }
        }).catch((error: AxiosError) => {
            if (error.response?.status === 400) {
                throw new Error(error.response.data as string);
            }
            throw new Error('Failed to create directory');
        }),

    getRoot: () => 
        api.get<Directory>('/directory/root')
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch root directory');
            }),

    getParents: (id: number) => 
        api.get<Directory[]>(`/directory/parents/${id}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch parent directories');
            }),

    getChildren: (id: number) => 
        api.get<Directory[]>(`/directory/children/${id}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch child directories');
            }),

    getById: (id: number) => 
        api.get<Directory>(`/directory/${id}`)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to fetch directory');
            }),
};

export const passwordAPI = {
    generatePassword: (length: number, upper: number, lower: number, digit: number, special: number) =>
        api.get<string>(`/api/password/generate?length=${length}&upper=${upper}&lower=${lower}&digit=${digit}&special=${special}`)
            .then(response => response.data)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error(error.response.data as string);
                }
                throw new Error('Failed to generate password');
            })
}; 