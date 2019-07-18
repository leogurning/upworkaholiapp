export interface ServiceSuccessResponse {
    message: string;
}

export interface ServiceErrorResponse {
    message: string;
    error: number;
    raw: string;
}