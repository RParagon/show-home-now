-- Simplificar a tabela interactions
DROP VIEW IF EXISTS daily_interactions;
DROP TABLE IF EXISTS interactions;

CREATE TABLE interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  device_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_source ON interactions(source);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Criar view para estatísticas diárias
CREATE VIEW daily_interactions AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  type,
  source,
  COUNT(*) as count
FROM interactions
GROUP BY DATE_TRUNC('day', created_at), type, source
ORDER BY date DESC; 