-- ============================================================
-- Q-Edge Guardian – Supabase Table Definitions
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Traffic Records
CREATE TABLE IF NOT EXISTS traffic_records (
    id              BIGSERIAL PRIMARY KEY,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vehicle_count   INTEGER NOT NULL,
    congestion_level VARCHAR(32) NOT NULL,
    recommendation  VARCHAR(256) NOT NULL DEFAULT 'No action required'
);

CREATE INDEX IF NOT EXISTS idx_traffic_records_timestamp
    ON traffic_records (timestamp DESC);

-- 2. Emergency Events
CREATE TABLE IF NOT EXISTS emergency_events (
    id              BIGSERIAL PRIMARY KEY,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vehicle_type    VARCHAR(64) NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    location        VARCHAR(128) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_emergency_events_timestamp
    ON emergency_events (timestamp DESC);

-- 3. Traffic Signals
CREATE TABLE IF NOT EXISTS traffic_signals (
    id              BIGSERIAL PRIMARY KEY,
    lane            VARCHAR(32) NOT NULL,
    signal_color    VARCHAR(16) NOT NULL,
    green_duration  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_traffic_signals_lane
    ON traffic_signals (lane);

-- ============================================================
-- Enable Row Level Security (required by Supabase) and allow
-- full access for the service_role key used by the backend.
-- ============================================================

ALTER TABLE traffic_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_signals  ENABLE ROW LEVEL SECURITY;

-- Allow the backend (service_role) full access
CREATE POLICY "Allow full access for service role" ON traffic_records
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for service role" ON emergency_events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for service role" ON traffic_signals
    FOR ALL USING (true) WITH CHECK (true);
