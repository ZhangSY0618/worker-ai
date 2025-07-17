/**
 * Cloudflare Worker AI 项目 (使用 Groq)
 * 提供基础的AI功能，包括文本生成、翻译等
 */

import Groq from "groq-sdk";

export interface Env {
  GROQ_API_KEY: string; // Groq API 密钥
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // 设置CORS头
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // 处理OPTIONS请求
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 路由处理
      switch (pathname) {
        case "/":
          return handleHome();
        case "/api/chat":
          return handleChat(request, env);
        case "/api/translate":
          return handleTranslate(request, env);
        case "/api/summarize":
          return handleSummarize(request, env);
        case "/api/models":
          return handleModels();
        default:
          return new Response("404 Not Found", {
            status: 404,
            headers: corsHeaders,
          });
      }
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({
          error: "服务器内部错误",
          message: (error as Error).message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};

/**
 * 首页处理
 */
function handleHome(): Response {
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cloudflare Worker AI (Groq)</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .container { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            .endpoint { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .method { display: inline-block; padding: 3px 8px; border-radius: 3px; color: white; font-weight: bold; }
            .post { background: #28a745; }
            .get { background: #007bff; }
            code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
            .groq-badge { background: #FF6B35; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; display: inline-block; margin-left: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Cloudflare Worker AI <span class="groq-badge">Powered by Groq</span></h1>
            <p>欢迎使用 Cloudflare Worker AI 服务！基于 Groq 的超快速推理引擎。</p>
            
            <h2>可用的API端点：</h2>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /api/chat</h3>
                <p>AI聊天对话 - 支持多种 Groq 模型</p>
                <p><strong>请求体：</strong> <code>{"message": "你好", "model": "llama3-8b-8192"}</code></p>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /api/translate</h3>
                <p>文本翻译 - 基于 AI 的智能翻译</p>
                <p><strong>请求体：</strong> <code>{"text": "Hello", "from": "English", "to": "Chinese"}</code></p>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /api/summarize</h3>
                <p>文本摘要 - 智能内容摘要生成</p>
                <p><strong>请求体：</strong> <code>{"text": "需要摘要的长文本..."}</code></p>
            </div>
            
            <div class="endpoint">
                <h3><span class="method get">GET</span> /api/models</h3>
                <p>获取可用的 Groq 模型列表</p>
            </div>
            
            <h2>🚀 特性：</h2>
            <ul>
                <li>⚡ 超快速推理 - 由 Groq 提供支持</li>
                <li>🌍 全球边缘部署 - Cloudflare Workers</li>
                <li>🔄 多模型支持 - Llama 3, Mixtral, Gemma 等</li>
                <li>📊 Token 使用统计</li>
            </ul>
        </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * 聊天对话处理
 */
async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { message, model = "llama3-8b-8192" } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "请提供消息内容" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "未配置 Groq API 密钥" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "你是一个helpful的AI助手，请用中文回答。" },
        { role: "user", content: message },
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return new Response(
      JSON.stringify({
        response: chatCompletion.choices[0]?.message?.content || "无法生成回复",
        model: model,
        usage: chatCompletion.usage,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Groq AI 服务暂时不可用",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * 翻译处理
 */
async function handleTranslate(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { text, from = "auto", to = "Chinese" } = await request.json();

  if (!text) {
    return new Response(JSON.stringify({ error: "请提供要翻译的文本" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "未配置 Groq API 密钥" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });

    const prompt = `请将以下文本翻译为${to}，只返回翻译结果，不要其他解释：\n\n${text}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1024,
    });

    const translated =
      chatCompletion.choices[0]?.message?.content?.trim() || "翻译失败";

    return new Response(
      JSON.stringify({
        original: text,
        translated: translated,
        from: from,
        to: to,
        usage: chatCompletion.usage,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "翻译服务暂时不可用",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * 文本摘要处理
 */
async function handleSummarize(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { text } = await request.json();

  if (!text) {
    return new Response(JSON.stringify({ error: "请提供要摘要的文本" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "未配置 Groq API 密钥" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });

    const prompt = `请为以下文本生成一个简洁的摘要，用中文回答：\n\n${text}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 512,
    });

    const summary =
      chatCompletion.choices[0]?.message?.content?.trim() || "摘要生成失败";

    return new Response(
      JSON.stringify({
        original_length: text.length,
        summary: summary,
        summary_length: summary.length,
        usage: chatCompletion.usage,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "摘要服务暂时不可用",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * 获取可用模型列表
 */
async function handleModels(): Promise<Response> {
  const models = [
    {
      id: "llama3-8b-8192",
      name: "Llama 3 8B",
      description: "高质量的对话和文本生成模型",
      context_length: 8192,
      recommended: true,
    },
    {
      id: "llama3-70b-8192",
      name: "Llama 3 70B",
      description: "更强大的对话和文本生成模型",
      context_length: 8192,
      recommended: false,
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      description: "高效的混合专家模型",
      context_length: 32768,
      recommended: false,
    },
    {
      id: "gemma-7b-it",
      name: "Gemma 7B",
      description: "Google 的开源对话模型",
      context_length: 8192,
      recommended: false,
    },
  ];

  return new Response(
    JSON.stringify({
      models,
      total: models.length,
      provider: "Groq",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
