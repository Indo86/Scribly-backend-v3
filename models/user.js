import { Sequelize } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refresh_token: Sequelize.TEXT,
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced"));

export default User;