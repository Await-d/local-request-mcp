import { z } from 'zod';
export declare const RequestParamsSchema: z.ZodObject<{
    url: z.ZodString;
    method: z.ZodDefault<z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    body: z.ZodOptional<z.ZodString>;
    timeout: z.ZodDefault<z.ZodNumber>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
    timeout: number;
    params?: Record<string, string | number | boolean> | undefined;
    headers?: Record<string, string> | undefined;
    body?: string | undefined;
}, {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | undefined;
    params?: Record<string, string | number | boolean> | undefined;
    headers?: Record<string, string> | undefined;
    body?: string | undefined;
    timeout?: number | undefined;
}>;
export type RequestParams = z.infer<typeof RequestParamsSchema>;
export interface RequestResponse {
    success: boolean;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    data?: any;
    error?: string;
    url: string;
    method: string;
    duration: number;
    timestamp: string;
}
/**
 * 执行本地网络请求
 */
export declare function executeLocalRequest(params: RequestParams): Promise<RequestResponse>;
//# sourceMappingURL=request.d.ts.map