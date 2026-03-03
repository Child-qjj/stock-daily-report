import { promises as fs } from 'fs';
import path from 'path';
import { StockData } from './fetch';
import { analyzeStock, generateMarketSummary } from './llm';

export async function generateDailyReport(stocks: StockData[]) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'digests', dateStr);
  
  await fs.mkdir(outputDir, { recursive: true });

  let reportContent = `# 每日科技股研报 (${dateStr})\n\n`;
  reportContent += `> 生成时间: ${new Date().toLocaleString()}\n\n`;

  // Market Summary
  const marketSummary = await generateMarketSummary(stocks);
  reportContent += `## 市场总览\n\n${marketSummary}\n\n---\n\n`;

  // Stock Details
  for (const stock of stocks) {
    console.log(`Generating analysis for ${stock.symbol}...`);
    const analysis = await analyzeStock(stock);
    
    reportContent += `### ${stock.name} (${stock.symbol})\n`;
    reportContent += `- **现价**: ${stock.price}\n`;
    reportContent += `- **涨跌**: ${stock.change} (${stock.changePercent.toFixed(2)}%)\n`;
    reportContent += `- **成交量**: ${(stock.volume / 1000000).toFixed(2)}M\n\n`;
    reportContent += `${analysis}\n\n`;
    reportContent += `---\n\n`;
  }

  const filePath = path.join(outputDir, 'report.md');
  await fs.writeFile(filePath, reportContent);
  console.log(`Report saved to ${filePath}`);

  return { filePath, content: reportContent };
}
