export interface User {
    id: number;
    email: string;
    login: string;
}

export interface Record {
    id: number;
    name: string;
    login: string;
    password: string;
    url: string;
    userId: number;
    directoryId: number;
}

export interface Directory {
    id: number;
    name: string;
    userId: number;
    parentId: number;
}

export interface AuthResponse {
    token: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    login: string;
    password: string;
}

export interface CreateRecordRequest {
    name: string;
    login: string;
    password: string;
    url: string;
}

export interface ShareRecordRequest {
    recordId: number;
    expirationDate: string;
}

export interface ShareTokenResponse {
    token: string;
    expirationDate: string;
} 