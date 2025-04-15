module.exports = {
  apps: [
    {
      name: 'editor',
      script: 'pnpm start',
      instances: "max",
      exec_mode: "cluster",
      // Important for Remix in cluster mode
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      // This helps prevent memory leaks
      max_memory_restart: '500M'
    },
  ],
}
