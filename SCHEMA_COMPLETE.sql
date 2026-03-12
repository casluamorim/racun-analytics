-- Racun Analytics Database Schema
-- Generated: 2026-03-12T16:20:57.484954

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  name VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openId (openId),
  INDEX idx_role (role)
);

CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  plan ENUM('free', 'starter', 'professional', 'enterprise') DEFAULT 'free',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- ============================================
-- INTEGRATION TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS integrationAccounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  platform ENUM('meta', 'google', 'tiktok', 'mercado_livre', 'shopee', 'amazon') NOT NULL,
  accountName VARCHAR(255) NOT NULL,
  accessToken TEXT NOT NULL,
  refreshToken TEXT,
  externalAccountId VARCHAR(255) NOT NULL,
  externalAccountName VARCHAR(255),
  status ENUM('active', 'inactive', 'error', 'expired') DEFAULT 'active',
  lastSyncAt TIMESTAMP,
  lastErrorAt TIMESTAMP,
  lastErrorMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  INDEX idx_clientPlatform (clientId, platform),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS integrationLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  status ENUM('success', 'error', 'pending') NOT NULL,
  message TEXT,
  recordsProcessed INT DEFAULT 0,
  recordsFailed INT DEFAULT 0,
  startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP,
  FOREIGN KEY (integrationAccountId) REFERENCES integrationAccounts(id),
  INDEX idx_integrationStatus (integrationAccountId, status),
  INDEX idx_createdAt (startedAt)
);

-- ============================================
-- META ADS TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS metaCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED') NOT NULL,
  objective VARCHAR(100),
  dailyBudget DECIMAL(12, 2),
  lifetimeBudget DECIMAL(12, 2),
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  syncedAt TIMESTAMP,
  FOREIGN KEY (integrationAccountId) REFERENCES integrationAccounts(id),
  INDEX idx_integrationAccount (integrationAccountId),
  INDEX idx_externalCampaignId (externalCampaignId)
);

CREATE TABLE IF NOT EXISTS metaMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metaCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2) NOT NULL,
  impressions INT NOT NULL,
  clicks INT NOT NULL,
  conversions DECIMAL(10, 2) NOT NULL,
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (metaCampaignId) REFERENCES metaCampaigns(id),
  INDEX idx_campaignDate (metaCampaignId, date),
  INDEX idx_date (date)
);

-- ============================================
-- GOOGLE ADS TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS googleAdsCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status ENUM('ENABLED', 'PAUSED', 'REMOVED', 'UNSPECIFIED') NOT NULL,
  advertisingChannelType VARCHAR(100),
  budget DECIMAL(12, 2),
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  syncedAt TIMESTAMP,
  FOREIGN KEY (integrationAccountId) REFERENCES integrationAccounts(id),
  INDEX idx_integrationAccount (integrationAccountId),
  INDEX idx_externalCampaignId (externalCampaignId)
);

CREATE TABLE IF NOT EXISTS googleAdsMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  googleAdsCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2) NOT NULL,
  impressions INT NOT NULL,
  clicks INT NOT NULL,
  conversions DECIMAL(10, 2) NOT NULL,
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (googleAdsCampaignId) REFERENCES googleAdsCampaigns(id),
  INDEX idx_campaignDate (googleAdsCampaignId, date),
  INDEX idx_date (date)
);

-- ============================================
-- CRM TABLES (Opcional)
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  status ENUM('new', 'qualified', 'demo', 'proposal', 'won', 'lost') DEFAULT 'new',
  source VARCHAR(100),
  value DECIMAL(12, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  INDEX idx_clientStatus (clientId, status),
  INDEX idx_email (email)
);

-- ============================================
-- AUDIT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS auditLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  userId INT,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resourceId INT,
  changes JSON,
  ipAddress VARCHAR(45),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_clientAction (clientId, action),
  INDEX idx_createdAt (createdAt)
);
