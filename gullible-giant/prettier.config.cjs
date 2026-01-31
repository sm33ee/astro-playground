/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'none',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
