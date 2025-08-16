CREATE TABLE IF NOT EXISTS acc_transaction_types (
    xact_type_code VARCHAR(10) NOT NULL PRIMARY KEY,
    xact_type_name VARCHAR(100) NOT NULL
);

INSERT INTO acc_transaction_types (xact_type_code, xact_type_name) VALUES
('CR', 'Credit'),
('DR', 'Debit');

CREATE TABLE IF NOT EXISTS acc_transaction_types_ext (
    xact_type_code_ext VARCHAR(10) NOT NULL PRIMARY KEY,
    xact_type_name_ext VARCHAR(100) NOT NULL
);

INSERT INTO acc_transaction_types_ext (xact_type_code_ext, xact_type_name_ext) VALUES
('SO', 'Sales Order'),
('RF', 'Refund'),
('MF', 'Merchant Fee');

CREATE TABLE IF NOT EXISTS acc_account_types (
  account_type_code VARCHAR(5) NOT NULL PRIMARY KEY,
  account_type_name VARCHAR(100) NOT NULL
);

INSERT INTO acc_account_types (account_type_code, account_type_name) VALUES
('AA', 'Asset'),
('AL', 'Liability'),
('RR', 'Revenue'),
('EE', 'Expense');

CREATE TABLE IF NOT EXISTS acc_ledgers (
    id SERIAL PRIMARY KEY,
    ledger_number VARCHAR(20) NOT NULL UNIQUE,
    account_type_code VARCHAR(5) NOT NULL REFERENCES acc_account_types(account_type_code),
    ledger_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO acc_ledgers (ledger_number, account_type_code, ledger_name) VALUES
('600', 'RR', 'Main Revenue Ledger');


CREATE TABLE IF NOT EXISTS acc_ledger_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ledger_id_cr INT NOT NULL REFERENCES acc_ledgers(id) ON DELETE CASCADE,
    ledger_id_dr INT NOT NULL REFERENCES acc_ledgers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS acc_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO acc_accounts (account_number, account_name) VALUES
('1000', 'Customer General Account');

CREATE TABLE IF NOT EXISTS acc_account_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ledger_number VARCHAR(20) NOT NULL REFERENCES acc_ledgers(ledger_number) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_type_code VARCHAR(10) NOT NULL REFERENCES acc_transaction_types(xact_type_code),
    account_type_code_ext VARCHAR(10) NOT NULL REFERENCES acc_transaction_types_ext(xact_type_code_ext),
    account_number VARCHAR(20) NOT NULL REFERENCES acc_accounts(account_number) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL
);