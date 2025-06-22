require('dotenv').config();

module.exports = {
  development: {
    username: 'sg_studio_backend_n30e_user',
    password: 'pM6VTTcP4clhCQ9Xi4CXHwiL6ti3VaWA',
    database: 'sg_studio_backend_n30e',
    host: 'dpg-d1c3kaadbo4c73chsi9g-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
