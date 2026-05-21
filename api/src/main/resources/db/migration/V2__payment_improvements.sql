-- Allows support payments without a linked project
ALTER TABLE payments ALTER COLUMN project_id DROP NOT NULL;

-- Category for payment type: projeto | suporte | outro
ALTER TABLE payments ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'projeto';

CREATE INDEX IF NOT EXISTS idx_payments_category ON payments(category);
