import yahooFinance from 'yahoo-finance2';
import { STOCKS } from './config';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  news: NewsItem[];
}

export interface NewsItem {
  title: string;
  summary?: string;
  link: string;
  publisher: string;
  providerPublishTime: Date;
}

export async function fetchAllStockData(): Promise<StockData[]> {
  const results: StockData[] = [];

  for (const stock of STOCKS) {
    try {
      console.log(`Fetching data for ${stock.symbol}...`);
      
      // Fetch quote
      const quote = await yahooFinance.quote(stock.symbol);
      
      // Fetch news
      const newsResult = await yahooFinance.search(stock.symbol, { newsCount: 5 });
      const news = (newsResult.news || []).map((item: any) => ({
        title: item.title,
        summary: item.summary || '', // Optional summary
        link: item.link,
        publisher: item.publisher || 'Unknown',
        providerPublishTime: new Date(item.providerPublishTime * 1000)
      })).slice(0, 5); // Limit to top 5 news

      results.push({
        symbol: stock.symbol,
        name: stock.name,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        news
      });

    } catch (error) {
      console.error(`Error fetching data for ${stock.symbol}:`, error);
    }
  }

  return results;
}
