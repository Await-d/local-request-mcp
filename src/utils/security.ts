import { URL } from 'url';

/**
 * 检查IP地址是否为本地地址
 */
export function isLocalAddress(hostname: string): boolean {
  // 本地环回地址
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }

  // IPv4内网地址检查
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipv4Match = hostname.match(ipv4Regex);

  if (ipv4Match) {
    const [, a, b, c, d] = ipv4Match.map(Number);

    // 验证IP地址格式
    if (a > 255 || b > 255 || c > 255 || d > 255) {
      return false;
    }

    // 内网地址范围
    return (
      // 10.0.0.0/8
      a === 10 ||
      // 172.16.0.0/12
      (a === 172 && b >= 16 && b <= 31) ||
      // 192.168.0.0/16
      (a === 192 && b === 168) ||
      // 链路本地地址 169.254.0.0/16
      (a === 169 && b === 254) ||
      // 环回地址 127.0.0.0/8
      a === 127
    );
  }

  // IPv6本地地址检查（简化版）
  if (hostname.includes(':')) {
    return (
      hostname.startsWith('::1') ||
      hostname.startsWith('fe80:') ||
      hostname.startsWith('fc00:') ||
      hostname.startsWith('fd00:')
    );
  }

  return false;
}

/**
 * 验证URL是否为本地地址
 */
export function validateLocalUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  try {
    const url = new URL(urlString);

    // 只允许HTTP和HTTPS协议
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        valid: false,
        error: `不支持的协议: ${url.protocol}。只支持 http 和 https`
      };
    }

    // 检查是否为本地地址
    if (!isLocalAddress(url.hostname)) {
      return {
        valid: false,
        error: `不允许访问非本地地址: ${url.hostname}。只允许访问本地网络地址`
      };
    }

    // 检查端口范围（避免系统端口）
    const port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80);
    if (port < 1 || port > 65535) {
      return {
        valid: false,
        error: `无效的端口号: ${port}`
      };
    }

    return { valid: true, url };
  } catch (error) {
    return {
      valid: false,
      error: `无效的URL格式: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 过滤敏感的请求头
 */
export function sanitizeHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-auth-token',
    'x-api-key'
  ];

  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (!sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}