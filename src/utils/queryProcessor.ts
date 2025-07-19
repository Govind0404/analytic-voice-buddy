import { opportunities, customers, getTotalSalesByQuarter, getSalesByRegion, getOpportunitiesByDateRange } from '../data/sampleData';

export interface QueryResult {
  type: 'text' | 'chart' | 'table';
  data: any;
  title: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  results?: QueryResult[];
  timestamp: Date;
}

export const processQuery = async (query: string): Promise<{ message: string; results: QueryResult[] }> => {
  const lowerQuery = query.toLowerCase();
  
  // Q1 2024 sales query
  if (lowerQuery.includes('q1 2024') || (lowerQuery.includes('total sales') && lowerQuery.includes('2024'))) {
    const q1Sales = getTotalSalesByQuarter(2024, 1);
    return {
      message: `Total sales in Q1 2024 were $${q1Sales.toLocaleString()}. This includes all closed won opportunities during January-March 2024.`,
      results: [{
        type: 'text',
        title: 'Q1 2024 Sales',
        data: { value: q1Sales, formatted: `$${q1Sales.toLocaleString()}` }
      }]
    };
  }
  
  // Sales by region
  if (lowerQuery.includes('by region') || lowerQuery.includes('regional sales')) {
    const regionData = getSalesByRegion();
    return {
      message: `Here's the breakdown of sales by region. North America leads with the highest sales volume.`,
      results: [{
        type: 'chart',
        title: 'Sales by Region',
        data: regionData.map(r => ({ name: r.region, value: r.amount, label: `$${r.amount.toLocaleString()}` }))
      }]
    };
  }
  
  // Opportunity pipeline
  if (lowerQuery.includes('pipeline') || lowerQuery.includes('opportunities')) {
    const pipelineData = opportunities.reduce((acc, opp) => {
      const existing = acc.find(item => item.stage === opp.stage);
      if (existing) {
        existing.count += 1;
        existing.value += opp.amount;
      } else {
        acc.push({ stage: opp.stage, count: 1, value: opp.amount });
      }
      return acc;
    }, [] as Array<{ stage: string; count: number; value: number }>);

    return {
      message: `Here's your current sales pipeline. You have ${opportunities.length} total opportunities across different stages.`,
      results: [{
        type: 'chart',
        title: 'Sales Pipeline by Stage',
        data: pipelineData.map(p => ({ 
          name: p.stage, 
          count: p.count, 
          value: p.value,
          label: `${p.count} opps - $${p.value.toLocaleString()}`
        }))
      }]
    };
  }
  
  // Top customers
  if (lowerQuery.includes('top customers') || lowerQuery.includes('best customers')) {
    const customerSales = customers.map(customer => {
      const customerOpps = opportunities.filter(o => o.customer_id === customer.id && o.stage === 'Closed Won');
      const totalSales = customerOpps.reduce((sum, o) => sum + o.amount, 0);
      return { ...customer, totalSales };
    }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);

    return {
      message: `Here are your top 5 customers by total sales value. Acme Corp leads with the highest revenue contribution.`,
      results: [{
        type: 'table',
        title: 'Top Customers by Sales',
        data: customerSales.map(c => ({
          Company: c.company,
          Industry: c.industry,
          Region: c.region,
          'Total Sales': `$${c.totalSales.toLocaleString()}`
        }))
      }]
    };
  }
  
  // Sales by product category
  if (lowerQuery.includes('product') || lowerQuery.includes('category')) {
    const productSales = opportunities
      .filter(o => o.stage === 'Closed Won')
      .reduce((acc, opp) => {
        const existing = acc.find(item => item.category === opp.product_category);
        if (existing) {
          existing.value += opp.amount;
        } else {
          acc.push({ category: opp.product_category, value: opp.amount });
        }
        return acc;
      }, [] as Array<{ category: string; value: number }>);

    return {
      message: `Here's the sales breakdown by product category. Software leads in total revenue.`,
      results: [{
        type: 'chart',
        title: 'Sales by Product Category',
        data: productSales.map(p => ({ 
          name: p.category, 
          value: p.value,
          label: `$${p.value.toLocaleString()}`
        }))
      }]
    };
  }
  
  // Average deal size
  if (lowerQuery.includes('average') && (lowerQuery.includes('deal') || lowerQuery.includes('order'))) {
    const closedWonOpps = opportunities.filter(o => o.stage === 'Closed Won');
    const averageSize = closedWonOpps.reduce((sum, o) => sum + o.amount, 0) / closedWonOpps.length;
    
    return {
      message: `The average deal size for closed won opportunities is $${Math.round(averageSize).toLocaleString()}. This is based on ${closedWonOpps.length} successful deals.`,
      results: [{
        type: 'text',
        title: 'Average Deal Size',
        data: { value: averageSize, formatted: `$${Math.round(averageSize).toLocaleString()}` }
      }]
    };
  }
  
  // Default response for unrecognized queries
  return {
    message: `I understand you're asking about "${query}". I can help you analyze sales data including quarterly totals, regional breakdowns, pipeline analysis, top customers, product performance, and deal metrics. Try asking about "Q1 2024 sales", "sales by region", or "top customers".`,
    results: []
  };
};