module.exports = {
  apps: [{
    name: 'pb-agile-drafts',
    script: './bdd/pocketbase',
    args: '--serve --http=127.0.0.1:8116 --dir=./bdd',
    cwd: '/sites/drafts/agile',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'drafts'
    }
  }]
};
