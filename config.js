const {
  DB_ADDRESS = 'mongodb://localhost:27017/moviesdb',
  JWT_SECRET = 'dev-secret',
  PORT = 8080,
  NODE_ENV,
} = process.env;

module.exports = {
  DB_ADDRESS, JWT_SECRET, PORT, NODE_ENV,
};
