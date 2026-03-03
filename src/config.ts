export const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  // 可以在这里添加更多股票
];

export const CONFIG = {
  // LLM 配置
  LLM_PROVIDER: process.env.LLM_PROVIDER || "openai", // "openai" | "anthropic" (此处暂只实现 OpenAI 兼容接口)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  LLM_MODEL: process.env.LLM_MODEL || "gpt-4o",

  // GitHub 配置 (用于发布 Issue)
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REPO_OWNER: process.env.REPO_OWNER, // 例如 "your-username"
  REPO_NAME: process.env.REPO_NAME,   // 例如 "stock-daily-report"

  // 报告语言
  LANGUAGE: process.env.REPORT_LANGUAGE || "zh-CN", // "zh-CN" | "en-US"
};
