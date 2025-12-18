require('dotenv').config();

module.exports = {
  development: {
    username: 'sg_studio_backend_4dwq_user',
    password: 'PFYGNG44UflSRLxFoethwOx0a9mlPndI',
    database: 'sg_studio_backend_4dwq',
    host: 'dpg-d3a1heili9vc7399ph6g-a.oregon-postgres.render.com',
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
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
