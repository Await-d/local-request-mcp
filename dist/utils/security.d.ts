import { URL } from 'url';
/**
 * 检查IP地址是否为本地地址
 */
export declare function isLocalAddress(hostname: string): boolean;
/**
 * 验证URL是否为本地地址
 */
export declare function validateLocalUrl(urlString: string): {
    valid: boolean;
    error?: string;
    url?: URL;
};
/**
 * 过滤敏感的请求头
 */
export declare function sanitizeHeaders(headers?: Record<string, string>): Record<string, string>;
//# sourceMappingURL=security.d.ts.map