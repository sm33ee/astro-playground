/**
 * Domain Configuration
 *
 * Configure allowed domains and domain-specific settings for the multi-domain routing system.
 */

export interface DomainConfig {
  name: string;
  enabled: boolean;
  description?: string;
}

/**
 * List of allowed domains for production.
 * In development, all domains are allowed by default.
 */
export const ALLOWED_DOMAINS: string[] = [
  'domain1.com',
  'domain2.com',
  'localhost',
  '127.0.0.1'
];

/**
 * Domain-specific configuration settings.
 * Add custom settings per domain as needed.
 */
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'domain1.com': {
    name: 'Domain 1',
    enabled: true,
    description: 'Primary domain'
  },
  'domain2.com': {
    name: 'Domain 2',
    enabled: true,
    description: 'Secondary domain'
  },
  localhost: {
    name: 'Local Development',
    enabled: true,
    description: 'Local development domain'
  },
  '127.0.0.1': {
    name: 'Local IP',
    enabled: true,
    description: 'Local development IP'
  }
};

/**
 * Check if a domain is allowed based on configuration.
 * In development mode, all domains are allowed.
 */
export const isDomainAllowed = (domain: string, isDev: boolean = false): boolean => {
  if (!domain) return false;
  if (isDev) return true;

  const normalizedDomain = domain.toLowerCase().trim();
  return ALLOWED_DOMAINS.includes(normalizedDomain);
};

/**
 * Get configuration for a specific domain.
 */
export const getDomainConfig = (domain: string): DomainConfig | undefined => {
  const normalizedDomain = domain.toLowerCase().trim();
  return DOMAIN_CONFIGS[normalizedDomain];
};
