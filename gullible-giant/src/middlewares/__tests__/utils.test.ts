import { normalizeDomain, shouldSkipRouting } from '../utils';

describe('utils', () => {
  describe('normalizeDomain', () => {
    it('should normalize domain to lowercase', () => {
      expect(normalizeDomain('EXAMPLE.COM')).toBe('example.com');
      expect(normalizeDomain('Example.Com')).toBe('example.com');
    });

    it('should trim whitespace', () => {
      expect(normalizeDomain('  example.com  ')).toBe('example.com');
      expect(normalizeDomain('\texample.com\n')).toBe('example.com');
    });

    it('should remove port number', () => {
      expect(normalizeDomain('example.com:3000')).toBe('example.com');
      expect(normalizeDomain('localhost:4321')).toBe('localhost');
    });

    it('should handle null and undefined', () => {
      expect(normalizeDomain(null)).toBe('');
      expect(normalizeDomain(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(normalizeDomain('')).toBe('');
      expect(normalizeDomain('   ')).toBe('');
    });

    it('should handle complex cases', () => {
      expect(normalizeDomain('  EXAMPLE.COM:8080  ')).toBe('example.com');
    });
  });

  describe('shouldSkipRouting', () => {
    it('should skip routing for tilde paths', () => {
      expect(shouldSkipRouting('/~allDomains')).toBe(true);
      expect(shouldSkipRouting('/~domain1.com/page')).toBe(true);
    });

    it('should skip routing for Astro internal paths', () => {
      expect(shouldSkipRouting('/_astro/client.js')).toBe(true);
      expect(shouldSkipRouting('/_astro/style.css')).toBe(true);
    });

    it('should skip routing for image paths', () => {
      expect(shouldSkipRouting('/_image/logo.png')).toBe(true);
      expect(shouldSkipRouting('/_image/assets/photo.jpg')).toBe(true);
    });

    it('should not skip routing for regular paths', () => {
      expect(shouldSkipRouting('/')).toBe(false);
      expect(shouldSkipRouting('/about')).toBe(false);
      expect(shouldSkipRouting('/api/hello')).toBe(false);
    });
  });
});
