#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
/**
 * 主函数 - 启动 MCP 服务器
 */
async function main() {
    try {
        // 创建服务器实例
        const server = createServer();
        // 创建stdio传输
        const transport = new StdioServerTransport();
        // 连接服务器和传输
        await server.connect(transport);
        // 服务器已启动
        console.error('Local Request MCP Server started successfully');
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
// 优雅关闭
process.on('SIGINT', () => {
    console.error('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
// 启动服务器
main().catch((error) => {
    console.error('Main function failed:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map