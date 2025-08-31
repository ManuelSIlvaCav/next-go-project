CREATE TABLE ins_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(50) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ins_policy_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES ins_policies(id),
    display_name VARCHAR(255) NOT NULL,
    excess DECIMAL(10, 2) NOT NULL,
    copay INTEGER NOT NULL,
    payout_limit NUMERIC CONSTRAINT limit_must_be_positive CHECK (payout_limit > 0),
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ins_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature VARCHAR(255) NOT NULL
);

CREATE TABLE ins_policy_variant_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_variant_id UUID REFERENCES ins_policy_variants(id),
    feature_id UUID REFERENCES ins_features(id)
);

CREATE TABLE ins_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ins_quote_insurable_obj (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES ins_quotes(id),
    insurable_obj_id UUID NOT NULL
);

CREATE TABLE ins_insurable_objs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    insurable_obj_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ins_insurable_obj_pet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insurable_obj_id UUID REFERENCES ins_insurable_objs(id) ON DELETE CASCADE,
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    species VARCHAR(50) NOT NULL,
    pedigree_type VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    healthy BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);