-- Criar enum para tipos de interação
CREATE TYPE interaction_type AS ENUM (
  'view', -- Visualização de imóvel
  'whatsapp', -- Clique no WhatsApp
  'phone', -- Clique no telefone
  'email', -- Clique no email
  'share' -- Compartilhamento
);

-- Criar tabela de interações
CREATE TABLE interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  type interaction_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT, -- Informações do navegador
  ip_address TEXT, -- IP do usuário (hash)
  referrer TEXT, -- De onde veio o usuário
  device_type TEXT -- Tipo de dispositivo (mobile, desktop, tablet)
);

-- Criar índices para melhor performance
CREATE INDEX idx_interactions_property_id ON interactions(property_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Criar view para estatísticas agregadas por dia
CREATE VIEW daily_interactions AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  type,
  COUNT(*) as count
FROM interactions
GROUP BY DATE_TRUNC('day', created_at), type
ORDER BY date DESC; 