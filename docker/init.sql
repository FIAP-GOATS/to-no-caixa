CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT ,
  email TEXT UNIQUE ,
  cnpj VARCHAR(18) UNIQUE,
  street_address TEXT,
  city TEXT,
  state VARCHAR(2),
  postal_code VARCHAR(10),
  type TEXT,
  registration_step TEXT NOT NULL DEFAULT 'BEGIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  cpf VARCHAR(14) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  registration_step TEXT NOT NULL DEFAULT 'BEGIN',
  CONSTRAINT chk_document CHECK (cnpj IS NOT NULL OR cpf IS NOT NULL)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  inventory INT NOT NULL DEFAULT 0,
  cost_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  supplier_name VARCHAR(100),
  supplier_id INTEGER,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  phonenumber VARCHAR(30),
  state TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_numbers (
  phonenumber VARCHAR(30),
  company_id INTEGER NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- CREATE TABLE messages (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   chat_id INTEGER REFERENCES chats(id),
--   direction TEXT CHECK (direction IN ('sent', 'received')),
--   content TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
