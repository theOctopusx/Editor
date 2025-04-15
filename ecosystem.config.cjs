module.exports = {
  apps: [
    {
      name: 'editor',
      script: 'pnpm start',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
  ],
}
