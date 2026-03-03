import OpenAI from 'openai';
import { CONFIG } from './config';
import { StockData, NewsItem } from './fetch';

const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
  baseURL: CONFIG.OPENAI_BASE_URL,
});

export async function analyzeStock(stock: StockData): Promise<string> {
  const newsText = stock.news.map((n, i) => `${i + 1}. ${n.title} (${n.publisher})`).join('\n');
  
  const prompt = `
你是一位专业的金融分析师。请根据以下股票数据和最新新闻，为 ${stock.name} (${stock.symbol}) 写一份简短的日报分析。
包括：
1. 今日表现点评（当前价格: ${stock.price}, 涨跌幅: ${stock.changePercent.toFixed(2)}%）。
2. 新闻摘要与潜在影响。
3. 短期趋势预测。

请使用 Markdown 格式，保持简洁专业。

新闻列表：
${newsText}
`;

  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.LLM_MODEL,
      messages: [
        { role: "system", content: "你是一位资深的股市分析师，擅长解读市场动态和新闻影响。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "无法生成分析。";
  } catch (error) {
    console.error(`LLM Analysis failed for ${stock.symbol}:`, error);
    return "分析生成失败。";
  }
}

export async function generateMarketSummary(stocks: StockData[]): Promise<string> {
    const marketData = stocks.map(s => `${s.symbol}: ${s.changePercent.toFixed(2)}%`).join(', ');
    const prompt = `
请根据以下主要科技股的今日表现，写一份简短的市场整体情绪总结。
股票表现: ${marketData}
`;

    try {
        const response = await openai.chat.completions.create({
            model: CONFIG.LLM_MODEL,
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content || "";
    } catch (e) {
        return "";
    }
}
