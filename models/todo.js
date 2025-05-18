import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Todo = db.define("todo", {
  text:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
  type: DataTypes.INTEGER,
  allowNull: false
  }

},{
  timestamps: false,
})

export default Todo