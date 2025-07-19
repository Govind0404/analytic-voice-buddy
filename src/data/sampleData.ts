export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  industry: string;
  region: string;
  created_date: string;
}

export interface Opportunity {
  id: number;
  customer_id: number;
  opportunity_name: string;
  stage: string;
  amount: number;
  probability: number;
  close_date: string;
  created_date: string;
  sales_rep: string;
  product_category: string;
}

export const customers: Customer[] = [
  { id: 1, name: "John Smith", email: "john@acme.com", company: "Acme Corp", industry: "Technology", region: "North America", created_date: "2023-01-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@globex.com", company: "Globex Corporation", industry: "Manufacturing", region: "Europe", created_date: "2023-02-20" },
  { id: 3, name: "Mike Chen", email: "mike@techstart.com", company: "TechStart Inc", industry: "Technology", region: "Asia Pacific", created_date: "2023-03-10" },
  { id: 4, name: "Emily Davis", email: "emily@retailpro.com", company: "RetailPro Solutions", industry: "Retail", region: "North America", created_date: "2023-04-05" },
  { id: 5, name: "David Wilson", email: "david@fintech.com", company: "FinTech Innovations", industry: "Finance", region: "Europe", created_date: "2023-05-12" },
];

export const opportunities: Opportunity[] = [
  { id: 1, customer_id: 1, opportunity_name: "Enterprise Software License", stage: "Closed Won", amount: 250000, probability: 100, close_date: "2024-03-15", created_date: "2024-01-10", sales_rep: "Alex Thompson", product_category: "Software" },
  { id: 2, customer_id: 2, opportunity_name: "Manufacturing Automation", stage: "Proposal", amount: 180000, probability: 75, close_date: "2024-04-20", created_date: "2024-02-01", sales_rep: "Maria Garcia", product_category: "Hardware" },
  { id: 3, customer_id: 3, opportunity_name: "Cloud Migration Services", stage: "Closed Won", amount: 95000, probability: 100, close_date: "2024-02-28", created_date: "2024-01-05", sales_rep: "Alex Thompson", product_category: "Services" },
  { id: 4, customer_id: 4, opportunity_name: "POS System Upgrade", stage: "Negotiation", amount: 75000, probability: 80, close_date: "2024-05-10", created_date: "2024-03-15", sales_rep: "Jennifer Lee", product_category: "Hardware" },
  { id: 5, customer_id: 5, opportunity_name: "Security Audit Package", stage: "Closed Won", amount: 45000, probability: 100, close_date: "2024-01-30", created_date: "2023-12-10", sales_rep: "Robert Kim", product_category: "Services" },
  { id: 6, customer_id: 1, opportunity_name: "Training & Support", stage: "Qualified", amount: 35000, probability: 60, close_date: "2024-06-15", created_date: "2024-04-01", sales_rep: "Alex Thompson", product_category: "Services" },
  { id: 7, customer_id: 3, opportunity_name: "Mobile App Development", stage: "Proposal", amount: 120000, probability: 70, close_date: "2024-07-20", created_date: "2024-03-20", sales_rep: "Maria Garcia", product_category: "Software" },
  { id: 8, customer_id: 2, opportunity_name: "Data Analytics Platform", stage: "Discovery", amount: 200000, probability: 40, close_date: "2024-08-30", created_date: "2024-04-10", sales_rep: "Jennifer Lee", product_category: "Software" },
];

export const getCustomerById = (id: number) => customers.find(c => c.id === id);

export const getOpportunitiesByCustomer = (customerId: number) => 
  opportunities.filter(o => o.customer_id === customerId);

export const getOpportunitiesByDateRange = (startDate: string, endDate: string) =>
  opportunities.filter(o => o.close_date >= startDate && o.close_date <= endDate);

export const getTotalSalesByQuarter = (year: number, quarter: number) => {
  const quarterDates = {
    1: { start: `${year}-01-01`, end: `${year}-03-31` },
    2: { start: `${year}-04-01`, end: `${year}-06-30` },
    3: { start: `${year}-07-01`, end: `${year}-09-30` },
    4: { start: `${year}-10-01`, end: `${year}-12-31` }
  };
  
  const dates = quarterDates[quarter as keyof typeof quarterDates];
  return getOpportunitiesByDateRange(dates.start, dates.end)
    .filter(o => o.stage === "Closed Won")
    .reduce((sum, o) => sum + o.amount, 0);
};

export const getSalesByRegion = () => {
  const regionSales = new Map<string, number>();
  
  opportunities
    .filter(o => o.stage === "Closed Won")
    .forEach(opp => {
      const customer = getCustomerById(opp.customer_id);
      if (customer) {
        const current = regionSales.get(customer.region) || 0;
        regionSales.set(customer.region, current + opp.amount);
      }
    });
    
  return Array.from(regionSales.entries()).map(([region, amount]) => ({
    region,
    amount
  }));
};