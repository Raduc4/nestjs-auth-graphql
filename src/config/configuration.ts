export default () => ({
  port: process.env.PORT || 10 || 8000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 27017,
  },
});
