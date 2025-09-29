import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { validateLocalUrl, sanitizeHeaders } from '../utils/security.js';
// 请求参数验证schema
export const RequestParamsSchema = z.object({
    url: z.string().min(1, '请求URL不能为空'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']).default('GET'),
    headers: z.record(z.string()).optional(),
    body: z.string().optional(),
    timeout: z.number().min(100).max(30000).default(5000),
    params: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
});
/**
 * 执行本地网络请求
 */
export async function executeLocalRequest(params) {
    const startTime = Date.now();
    try {
        // 验证和解析请求参数
        const validatedParams = RequestParamsSchema.parse(params);
        // 验证URL是否为本地地址
        const urlValidation = validateLocalUrl(validatedParams.url);
        if (!urlValidation.valid) {
            return {
                success: false,
                error: urlValidation.error,
                url: validatedParams.url,
                method: validatedParams.method,
                duration: Date.now() - startTime
            };
        }
        // 准备请求配置
        const config = {
            method: validatedParams.method.toLowerCase(),
            url: validatedParams.url,
            timeout: validatedParams.timeout,
            headers: sanitizeHeaders(validatedParams.headers),
            params: validatedParams.params,
            data: validatedParams.body,
            maxContentLength: 10 * 1024 * 1024, // 10MB限制
            maxBodyLength: 10 * 1024 * 1024, // 10MB限制
            validateStatus: () => true // 接受所有状态码
        };
        // 发送请求
        const response = await axios(config);
        const duration = Date.now() - startTime;
        // 处理响应数据
        let responseData;
        try {
            // 尝试解析JSON
            responseData = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;
        }
        catch {
            // 如果不是JSON，保持原始数据
            responseData = response.data;
        }
        return {
            success: response.status >= 200 && response.status < 400,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: responseData,
            url: validatedParams.url,
            method: validatedParams.method,
            duration
        };
    }
    catch (error) {
        const duration = Date.now() - startTime;
        // 处理不同类型的错误
        let errorMessage = '未知错误';
        let status;
        let statusText;
        if (error instanceof AxiosError) {
            if (error.response) {
                // 服务器响应了错误状态码
                status = error.response.status;
                statusText = error.response.statusText;
                errorMessage = `HTTP ${status}: ${statusText}`;
            }
            else if (error.request) {
                // 请求已发送但没有收到响应
                errorMessage = '请求超时或连接失败';
            }
            else {
                // 请求配置错误
                errorMessage = `请求配置错误: ${error.message}`;
            }
        }
        else if (error instanceof z.ZodError) {
            // 参数验证错误
            errorMessage = `参数验证失败: ${error.errors.map(e => e.message).join(', ')}`;
        }
        else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            success: false,
            error: errorMessage,
            status,
            statusText,
            url: params.url,
            method: params.method || 'GET',
            duration
        };
    }
}
//# sourceMappingURL=request.js.map