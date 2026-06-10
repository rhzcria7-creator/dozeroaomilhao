-- Schema do banco de dados - Do Zero ao Milhão
-- Execute este script no PostgreSQL

-- Tabela de compras
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  product TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'brl',
  status TEXT DEFAULT 'pending' NOT NULL,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  status_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_amount CHECK (amount >= 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'refunded', 'cancelled'))
);

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);

-- Tabela de tokens de download
CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_count INTEGER DEFAULT 0,
  last_used_ip TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_token CHECK (length(token) >= 40)
);

-- Índice para validação rápida de tokens
CREATE INDEX IF NOT EXISTS idx_downloads_token ON downloads(token);
CREATE INDEX IF NOT EXISTS idx_downloads_purchase_id ON downloads(purchase_id);
CREATE INDEX IF NOT EXISTS idx_downloads_expires_at ON downloads(expires_at);

-- Tabela de tokens revogados (para segurança adicional)
CREATE TABLE IF NOT EXISTS revoked_tokens (
  id SERIAL PRIMARY KEY,
  token_hash TEXT UNIQUE NOT NULL,
  revoked_at TIMESTAMP DEFAULT NOW() NOT NULL,
  reason TEXT,
  
  CONSTRAINT valid_token_hash CHECK (length(token_hash) >= 64)
);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_hash ON revoked_tokens(token_hash);

-- Tabela de newsletter/leads
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'website' NOT NULL,
  tags JSONB DEFAULT '[]',
  subscribed_at TIMESTAMP DEFAULT NOW() NOT NULL,
  unsubscribed_at TIMESTAMP,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índice para segmentação
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON subscribers(subscribed_at DESC);

-- Tabela de logs de atividade (auditoria)
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Índice para análise
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Comentários
COMMENT ON TABLE purchases IS 'Registra todas as compras realizadas';
COMMENT ON TABLE downloads IS 'Tokens seguros para download de arquivos';
COMMENT ON TABLE revoked_tokens IS 'Tokens que foram revogados por segurança';
COMMENT ON TABLE subscribers IS 'Assinantes da newsletter';
COMMENT ON TABLE activity_logs IS 'Logs de auditoria de todas as ações';

-- Permissões (ajuste conforme seu usuário)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
