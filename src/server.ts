import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { executeLocalRequest, RequestParamsSchema } from './tools/request.js';

/**
 * 创建并配置 MCP 服务器
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'local-request-mcp',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // 注册工具列表处理器
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'local_request',
        description: '向本地网络地址发送HTTP请求。支持GET、POST、PUT、DELETE等方法，只允许访问本地地址（localhost、内网IP等）',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: '请求的URL，必须是本地地址（如 http://localhost:3000、http://192.168.1.100:8080 等）'
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
              default: 'GET',
              description: 'HTTP请求方法'
            },
            headers: {
              type: 'object',
              additionalProperties: { type: 'string' },
              description: '请求头（敏感头部将被自动过滤）'
            },
            body: {
              type: 'string',
              description: '请求体内容（字符串格式，可以是JSON字符串）'
            },
            timeout: {
              type: 'number',
              minimum: 100,
              maximum: 30000,
              default: 5000,
              description: '请求超时时间（毫秒），范围：100-30000'
            },
            params: {
              type: 'object',
              additionalProperties: {
                oneOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' }
                ]
              },
              description: 'URL查询参数'
            }
          },
          required: ['url'],
          additionalProperties: false
        }
      }
    ]
  }));

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'local_request': {
          // 验证参数
          const validationResult = RequestParamsSchema.safeParse(args);
          if (!validationResult.success) {
            throw new McpError(
              ErrorCode.InvalidParams,
              `参数验证失败: ${validationResult.error.errors.map(e => e.message).join(', ')}`
            );
          }

          // 执行请求
          const result = await executeLocalRequest(validationResult.data);

          // 返回结果
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `未知的工具: ${name}`
          );
      }
    } catch (error) {
      // 如果已经是MCP错误，直接抛出
      if (error instanceof McpError) {
        throw error;
      }

      // 转换为MCP错误
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new McpError(
        ErrorCode.InternalError,
        `工具执行失败: ${errorMessage}`
      );
    }
  });

  // 错误处理
  server.onerror = (error) => {
    console.error('[MCP Server Error]', error);
  };

  return server;
}