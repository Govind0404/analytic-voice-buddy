-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('SMB', 'Mid', 'Enterprise')),
  industry TEXT,
  region TEXT NOT NULL CHECK (region IN ('NA', 'EMEA', 'APAC', 'LATAM')),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table  
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  close_date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL CHECK (amount >= 0),
  stage TEXT NOT NULL CHECK (stage IN ('Open', 'Closed Won', 'Closed Lost', 'Negotiation', 'Proposal')),
  product TEXT,
  rep_owner TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staging table for CSV imports
CREATE TABLE public.staging_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_data JSONB NOT NULL,
  source_file TEXT NOT NULL,
  table_target TEXT NOT NULL,
  imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_imports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read for analytics)
CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on staging_imports" ON public.staging_imports FOR SELECT USING (true);

-- Create insert policies for data loading
CREATE POLICY "Allow public insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on opportunities" ON public.opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on staging_imports" ON public.staging_imports FOR INSERT WITH CHECK (true);

-- Create helpful views
CREATE VIEW public.v_booked_revenue AS
SELECT 
  DATE_TRUNC('month', close_date) as month,
  DATE_TRUNC('quarter', close_date) as quarter,
  region,
  segment,
  industry,
  SUM(amount) as total_revenue,
  COUNT(*) as deal_count,
  AVG(amount) as avg_deal_size
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE stage = 'Closed Won'
GROUP BY DATE_TRUNC('month', close_date), DATE_TRUNC('quarter', close_date), region, segment, industry;

CREATE VIEW public.v_pipeline AS
SELECT 
  region,
  segment,
  stage,
  SUM(amount) as pipeline_value,
  COUNT(*) as deal_count
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE stage IN ('Open', 'Negotiation', 'Proposal')
GROUP BY region, segment, stage;

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.customers (customer_name, segment, industry, region, created_date) VALUES
('Acme Corp', 'Enterprise', 'Technology', 'NA', '2023-01-15'),
('Global Systems Ltd', 'Mid', 'Manufacturing', 'EMEA', '2023-02-20'),
('Innovate Solutions', 'SMB', 'Healthcare', 'APAC', '2023-03-10'),
('TechStart Inc', 'SMB', 'Technology', 'NA', '2023-01-25'),
('MegaCorp International', 'Enterprise', 'Finance', 'EMEA', '2023-02-05'),
('Regional Industries', 'Mid', 'Manufacturing', 'LATAM', '2023-03-20'),
('Digital Dynamics', 'Enterprise', 'Technology', 'APAC', '2023-01-30'),
('Healthcare Plus', 'Mid', 'Healthcare', 'NA', '2023-02-15'),
('Finance Forward', 'Enterprise', 'Finance', 'EMEA', '2023-03-05'),
('Small Business Co', 'SMB', 'Retail', 'LATAM', '2023-02-28');

-- Insert sample opportunities
INSERT INTO public.opportunities (customer_id, close_date, amount, stage, product, rep_owner) 
SELECT 
  c.id,
  CASE 
    WHEN random() < 0.3 THEN CURRENT_DATE + (random() * 90)::int
    WHEN random() < 0.6 THEN CURRENT_DATE - (random() * 180)::int
    ELSE CURRENT_DATE - (random() * 365)::int
  END,
  (random() * 500000 + 10000)::numeric(15,2),
  CASE 
    WHEN random() < 0.4 THEN 'Closed Won'
    WHEN random() < 0.2 THEN 'Closed Lost'
    ELSE (ARRAY['Open', 'Negotiation', 'Proposal'])[floor(random() * 3 + 1)]
  END,
  (ARRAY['Product A', 'Product B', 'Product C', 'Enterprise Suite', 'Starter Pack'])[floor(random() * 5 + 1)],
  (ARRAY['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Davis', 'Tom Wilson'])[floor(random() * 5 + 1)]
FROM public.customers c
CROSS JOIN generate_series(1, 3) -- 3 opportunities per customer

UNION ALL

-- Add some specific Q1 2024 data for testing
SELECT 
  c.id,
  '2024-01-15'::date + (row_number() OVER ())::int,
  (random() * 300000 + 50000)::numeric(15,2),
  'Closed Won',
  'Q1 Special',
  'Sales Team'
FROM public.customers c
WHERE c.segment = 'Enterprise'
LIMIT 5;

-- Create indexes for performance
CREATE INDEX idx_opportunities_close_date ON public.opportunities(close_date);
CREATE INDEX idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX idx_opportunities_customer_id ON public.opportunities(customer_id);
CREATE INDEX idx_customers_segment ON public.customers(segment);
CREATE INDEX idx_customers_region ON public.customers(region);