import { isDomainAllowed, getDomainConfig, ALLOWED_DOMAINS } from '../domains';

describe('domains config', () => {
  describe('isDomainAllowed', () => {
    it('should allow domains in the whitelist', () => {
      expect(isDomainAllowed('domain1.com', false)).toBe(true);
      expect(isDomainAllowed('domain2.com', false)).toBe(true);
      expect(isDomainAllowed('localhost', false)).toBe(true);
    });

    it('should reject domains not in the whitelist', () => {
      expect(isDomainAllowed('evil.com', false)).toBe(false);
      expect(isDomainAllowed('unknown.net', false)).toBe(false);
    });

    it('should allow all domains in dev mode', () => {
      expect(isDomainAllowed('evil.com', true)).toBe(true);
      expect(isDomainAllowed('any-domain.com', true)).toBe(true);
      expect(isDomainAllowed('localhost', true)).toBe(true);
    });

    it('should handle case insensitivity', () => {
      expect(isDomainAllowed('DOMAIN1.COM', false)).toBe(true);
      expect(isDomainAllowed('Domain2.COM', false)).toBe(true);
    });

    it('should handle whitespace', () => {
      expect(isDomainAllowed('  domain1.com  ', false)).toBe(true);
    });

    it('should reject empty domain', () => {
      expect(isDomainAllowed('', false)).toBe(false);
      expect(isDomainAllowed('', true)).toBe(false);
    });
  });

  describe('getDomainConfig', () => {
    it('should return config for valid domains', () => {
      const config = getDomainConfig('domain1.com');
      expect(config).toBeDefined();
      expect(config?.name).toBe('Domain 1');
      expect(config?.enabled).toBe(true);
    });

    it('should return undefined for unknown domains', () => {
      expect(getDomainConfig('unknown.com')).toBeUndefined();
    });

    it('should handle case insensitivity', () => {
      const config = getDomainConfig('DOMAIN1.COM');
      expect(config).toBeDefined();
      expect(config?.name).toBe('Domain 1');
    });

    it('should handle whitespace', () => {
      const config = getDomainConfig('  localhost  ');
      expect(config).toBeDefined();
      expect(config?.name).toBe('Local Development');
    });
  });

  describe('ALLOWED_DOMAINS', () => {
    it('should contain expected domains', () => {
      expect(ALLOWED_DOMAINS).toContain('domain1.com');
      expect(ALLOWED_DOMAINS).toContain('domain2.com');
      expect(ALLOWED_DOMAINS).toContain('localhost');
      expect(ALLOWED_DOMAINS).toContain('127.0.0.1');
    });

    it('should be an array', () => {
      expect(Array.isArray(ALLOWED_DOMAINS)).toBe(true);
    });
  });
});
