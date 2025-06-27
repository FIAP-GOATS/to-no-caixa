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
