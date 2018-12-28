// Azure Mssql configuration
const mssqlConfig = {
  user: 'pwa-demo',
  password: 'd4KIlHWk1KR7VNYxMWqq',
  server: 'pwa-demo.database.windows.net',
  database: 'pwa-demo',
  options: {
    encrypt: true,
  },
};

const mongoDBConfig = {
  url: 'mongodb://localhost:27017',
  database: 'pwa-demo',
};

module.exports = {
  mssqlConfig,
  mongoDBConfig,
};
