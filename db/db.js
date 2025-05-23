module.exports = {
  development: {
    username: 'sg_studio_backend_user',
    password: 'RUan3F3DqPpeCpZW7VZqVnLWNOQDDf2x',
    database: 'sg_studio_backend',
    host: 'dpg-d0nrh73uibrs73c40i30-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
