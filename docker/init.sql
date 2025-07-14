CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT ,
  email TEXT UNIQUE ,
  cnpj VARCHAR(18) UNIQUE ,         -- formato 00.000.000/0000-00
  registration_number VARCHAR(30),
  street_address TEXT,
  city TEXT,
  state VARCHAR(2),                         -- Ex: SP, RJ, etc.
  postal_code VARCHAR(10),                  -- Ex: 12345-678
  type TEXT,                                -- Tipo de estabelecimento (padaria, restaurante etc.)
  registration_step TEXT NOT NULL DEFAULT 'BEGIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj VARCHAR(18) UNIQUE,         -- formato 00.000.000/0000-00
  cpf VARCHAR(14) UNIQUE,          -- formato 000.000.000-00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_document CHECK (cnpj IS NOT NULL OR cpf IS NOT NULL)  -- CPF ou CNPJ deve estar preenchido
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    inventory INT NOT NULL DEFAULT 0,
    cost_price DECIMAL(10, 2) NOT NULL,  -- Preço de custo
    sale_price DECIMAL(10, 2) NOT NULL,  -- Preço de venda
    supplier_name VARCHAR(100),LLLL
    FOREIGN KEY (supplier_name) REFERENCES suppliers(name)
);
