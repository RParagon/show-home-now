-- Adicionar campo source na tabela interactions
ALTER TABLE interactions
ADD COLUMN source TEXT;

-- Criar índice para melhorar performance de consultas por source
CREATE INDEX idx_interactions_source ON interactions(source);

-- Atualizar a view de estatísticas diárias para incluir source
DROP VIEW IF EXISTS daily_interactions;
CREATE VIEW daily_interactions AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  type,
  source,
  COUNT(*) as count
FROM interactions
GROUP BY DATE_TRUNC('day', created_at), type, source
ORDER BY date DESC; 