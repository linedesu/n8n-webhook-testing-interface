
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface KeyValuePair {
    id: string;
    key: string;
    value: string;
}

export interface KeyFilePair {
    id: string;
    key: string;
    file: File | null;
}

export interface RequestData {
    method: HTTPMethod;
    url: string;
    queryParams: KeyValuePair[];
    headers: KeyValuePair[];
    body: string;
    files: KeyFilePair[];
}

export interface ResponseData {
    status: number;
    headers: { [key: string]: string };
    body: string;
    responseTime: number;
}

export interface HistoryItem extends RequestData {
    id: string;
}