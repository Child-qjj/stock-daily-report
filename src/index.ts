import dotenv from 'dotenv';
dotenv.config();

import { fetchAllStockData } from './fetch';
import { generateDailyReport } from './report';
import { createGitHubIssue } from './notify';

async function main() {
  try {
    console.log('Starting Stock Daily Report...');
    
    // 1. Fetch Data
    console.log('Phase 1: Fetching Stock Data...');
    const stocks = await fetchAllStockData();
    console.log(`Fetched ${stocks.length} stocks.`);

    // 2. Analyze & Generate Report
    console.log('Phase 2: Analyzing and Generating Report...');
    const { filePath, content } = await generateDailyReport(stocks);

    // 3. Notify (GitHub Issue)
    console.log('Phase 3: Notifying...');
    const dateStr = new Date().toISOString().split('T')[0];
    await createGitHubIssue(`📈 每日科技股研报 ${dateStr}`, content, 'daily-report');

    console.log('Daily Report Completed Successfully.');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();
