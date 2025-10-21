module.exports = {
  apps: [
    {
      name: 'pb-agile-drafts',
      script: '/sites/drafts/agile/bdd/pocketbase',
      args: 'serve --http=127.0.0.1:8116',
      cwd: '/sites/drafts/agile/bdd',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '200M',
      error_file: '/sites/drafts/agile/bdd/logs/pb-agile-drafts-error.log',
      out_file: '/sites/drafts/agile/bdd/logs/pb-agile-drafts-out.log',
      log_file: '/sites/drafts/agile/bdd/logs/pb-agile-drafts-combined.log',
      time: true
    },
    {
      name: 'pb-agile-prod',
      script: '/sites/prod/agile/bdd/pocketbase',
      args: 'serve --http=127.0.0.1:8117',
      cwd: '/sites/prod/agile/bdd',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '200M',
      error_file: '/sites/drafts/agile/bdd/logs/pb-agile-prod-error.log',
      out_file: '/sites/drafts/agile/bdd/logs/pb-agile-prod-out.log',
      log_file: '/sites/drafts/agile/bdd/logs/pb-agile-prod-combined.log',
      time: true
    }
  ]
};