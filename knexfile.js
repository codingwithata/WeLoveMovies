const path = require("path");

require("dotenv").config();
const { parse } = require("pg-connection-string");

const {
  DATABASE_URL = "postgres://dev_wdbo_user:DqeTJu08NeraPcHoR2ygU5GN3G0cT2pi@dpg-cmtrsv6n7f5s73b1msg0-a.oregon-postgres.render.com/dev_wdbo",
} = process.env;

const postgresConnectionConfig = parse(DATABASE_URL);
postgresConnectionConfig.ssl = { rejectUnauthorized: false };

module.exports = {
  development: {
    client: "postgresql",
    connection: postgresConnectionConfig,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: postgresConnectionConfig,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};
