module.exports = {
  apps: [
    {
      name: 'editor',
      script: 'pnpm start',
      instances: "max",
      exec_mode: "cluster"
    },
  ],
}
