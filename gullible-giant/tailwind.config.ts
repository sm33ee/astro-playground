import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 Configuration
 *
 * Note: Theme customizations (colors, spacing, fonts) are defined using the
 * @theme directive in src/styles/global.css. This config file is kept for
 * compatibility with IDE tooling and any plugins that may reference it.
 *
 * @see src/styles/global.css for theme definitions
 */
const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
